import React from "react";
import Routes from "./routes";

import { loadReCaptcha } from "react-recaptcha-v3-global";
import _ from "lodash";
import { connect } from "react-redux";
import messages from "./components/common/intlMessages";
import { addLocaleData, IntlProvider } from "react-intl";
import { flattenMessages } from "./components/common/messageUtils";
import { languageActions } from "./actions";
import { languageConstants } from "./constants";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { IntlCapture } from "../modules/common/notification";

class App extends React.Component {
  componentDidMount() {
    loadReCaptcha("6LeIoHkUAAAAANZKP5vkvU-B2uEuJBhv13_6h9-8");

    // Add JIRA widget if the env is UAT
    if (process.env.REACT_APP_CERTA_ENV === "UAT") {
      const script = document.createElement("script");
      script.setAttribute(
        "src",
        "https://thevetted.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-wkhsc1/b/45/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=5fcd3be7"
      );
      document.body.appendChild(script);
    }
  }

  render = () => {
    const user = this.props.authentication.user;
    if (
      user &&
      user.prefered_language &&
      this.props.languageSelector.language &&
      user.prefered_language !== this.props.languageSelector.language
    ) {
      user.prefered_language = this.props.languageSelector.language;
      this.props.dispatch(
        languageActions.updateUserLanguage(user.prefered_language)
      );
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
      const reactLocale = locale.split("-")[0];
      addLocaleData(require(`react-intl/locale-data/${reactLocale}`));
    }
    const messagesDefaultLocale = flattenMessages(
      messages[languageConstants.DEFAULT_LOCALE]
    );
    let messageTranslate = messagesDefaultLocale;
    if (!messages[locale]) {
      locale = locale.split("-")[0];
    }
    if (messages[locale]) {
      messageTranslate = flattenMessages(messages[locale]);
      if (_.includes(locale, "-")) {
        // has parent locale
        const parentLocale = locale.split("-")[0];
        if (messages[parentLocale]) {
          // parent locale supported
          messageTranslate = Object.assign(
            {},
            flattenMessages(messages[parentLocale]),
            messageTranslate
          );
        }
      }

      const missing = Object.keys(messagesDefaultLocale).reduce(
        (missing, key) => {
          messageTranslate[key] || missing.push(key);
          return missing;
        },
        []
      );
      messageTranslate = Object.assign(
        {},
        messagesDefaultLocale,
        messageTranslate
      );
    }
    return (
      <ErrorBoundary>
        <IntlProvider locale={locale} messages={messageTranslate}>
          <React.Fragment>
            <Routes />
            <IntlCapture />
          </React.Fragment>
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
