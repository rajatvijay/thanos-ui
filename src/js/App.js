import React from "react";

import Routes from "./routes";

import { loadReCaptcha } from "react-recaptcha-v3";
import { connect } from "react-redux";
import messages from "./components/common/intlMessages";
import { addLocaleData, IntlProvider, injectIntl } from "react-intl";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import fr from "react-intl/locale-data/fr";
import { flattenMessages } from "./components/common/messageUtils";
import { languageActions } from "./actions";

addLocaleData([...en, ...es, ...fr]);

class App extends React.Component {
  componentDidMount() {
    loadReCaptcha("6LeIoHkUAAAAANZKP5vkvU-B2uEuJBhv13_6h9-8");
    let preferredLanguage = this.props.user
      ? this.props.user.prefered_language
      : "en";
    if (this.props.user) {
      this.props.dispatch(
        languageActions.updateUserLanguage(preferredLanguage)
      );
    }
  }

  render = () => {
    let locale = this.props.user
      ? this.props.user.prefered_language
      : this.props.languageSelector.language ||
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage ||
        "en";
    let messageTranslate = messages[locale] || messages["en"];
    return (
      <IntlProvider
        locale={locale}
        messages={flattenMessages(messageTranslate)}
      >
        <Routes />
      </IntlProvider>
    );
  };
}
function mapStateToProps(state) {
  const { languageSelector, config, authentication } = state;
  const { user } = authentication;
  return {
    user,
    languageSelector,
    config
  };
}

export default connect(mapStateToProps)(App);
