import React from "react";

import Routes from "./routes";

import { loadReCaptcha } from "react-recaptcha-v3";
import { connect } from "react-redux";
import messages from "./components/common/intlMessages";
import { addLocaleData, IntlProvider, injectIntl } from "react-intl";
import { flattenMessages } from "./components/common/messageUtils";
import { languageConstants } from "./constants";

class App extends React.Component {
  componentDidMount() {
    loadReCaptcha("6LeIoHkUAAAAANZKP5vkvU-B2uEuJBhv13_6h9-8");
  }

  render = () => {
    let user = this.props.authentication.user;
    let locale =
      (user && user.prefered_language) ||
      this.props.languageSelector.language ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage ||
      languageConstants.DEFAULT_LOCALE;
    addLocaleData(require(`react-intl/locale-data/${locale}`));
    let messagesDefaultLocale = flattenMessages(
      messages[languageConstants.DEFAULT_LOCALE]
    );
    let messageTranslate = messagesDefaultLocale;
    console.log(locale);
    if (messages[locale]) {
      messageTranslate = Object.assign(
        {},
        messagesDefaultLocale,
        flattenMessages(messages[locale])
      );
    }
    console.log(messageTranslate);
    return (
      <IntlProvider locale={locale} messages={messageTranslate}>
        <Routes />
      </IntlProvider>
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
