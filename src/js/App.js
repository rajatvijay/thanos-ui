import React from "react";
import Routes from "./routes";

import { loadReCaptcha } from "react-recaptcha-v3-global";
import _ from "lodash";
import { connect } from "react-redux";
import messages from "./components/common/intlMessages";
import { addLocaleData, IntlProvider, injectIntl } from "react-intl";
import { flattenMessages } from "./components/common/messageUtils";
import { languageActions } from "./actions";
import { languageConstants } from "./constants";
import ErrorBoundary from "./components/common/ErrorBoundary";

class App extends React.Component {
  componentDidMount() {
    loadReCaptcha("6LeIoHkUAAAAANZKP5vkvU-B2uEuJBhv13_6h9-8");
  }

  render = () => {
    let user = this.props.authentication.user;
    if (
      user &&
      user.prefered_language &&
      this.props.languageSelector.language &&
      user.prefered_language != this.props.languageSelector.language
    ) {
      user.prefered_language = this.props.languageSelector.language;
      this.props.dispatch(
        languageActions.updateUserLanguage(user.prefered_language)
      );
      console.log("Changing user's language:", user.prefered_language);
    }
    let locale =
      this.props.languageSelector.language ||
      (user && user.prefered_language) ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage ||
      languageConstants.DEFAULT_LOCALE;
    try {
      addLocaleData(require(`react-intl/locale-data/${locale}`));
    } catch (e) {
      console.log("Missing react support for:", locale);
      let reactLocale = locale.split("-")[0];
      addLocaleData(require(`react-intl/locale-data/${reactLocale}`));
    }
    let messagesDefaultLocale = flattenMessages(
      messages[languageConstants.DEFAULT_LOCALE]
    );
    let messageTranslate = messagesDefaultLocale;
    if (!messages[locale]) {
      console.log("Missing support for:", locale);
      locale = locale.split("-")[0];
    }
    if (messages[locale]) {
      messageTranslate = flattenMessages(messages[locale]);
      if (_.includes(locale, "-")) {
        // has parent locale
        let parentLocale = locale.split("-")[0];
        if (messages[parentLocale]) {
          // parent locale supported
          console.log("Merging texts from parent locale:", parentLocale);
          messageTranslate = Object.assign(
            {},
            flattenMessages(messages[parentLocale]),
            messageTranslate
          );
        }
      }

      let missing = Object.keys(messagesDefaultLocale).reduce(
        (missing, key) => {
          messageTranslate[key] || missing.push(key);
          return missing;
        },
        []
      );
      missing.length && console.log("Missing translations for:", missing);
      messageTranslate = Object.assign(
        {},
        messagesDefaultLocale,
        messageTranslate
      );
    } else {
      console.log("Missing support for:", locale);
    }
    return (
      <ErrorBoundary>
        <IntlProvider locale={locale} messages={messageTranslate}>
          <Routes />
        </IntlProvider>
      </ErrorBoundary>
    );
  };
}
function mapStateToProps(state) {
  const { languageSelector, authentication, config } = state;
  return {
    languageSelector,
    authentication,
    config
  };
}

export default connect(mapStateToProps)(App);
