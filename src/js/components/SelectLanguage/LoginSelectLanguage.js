import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { languageActions } from "../../actions";

const Option = Select.Option;

class LoginSelectLanguage extends React.Component {
  handleLanguageChangeLogin = value => {
    this.props.dispatch(languageActions.setLanguage(value));
  };
  render() {
    let preferredLanguage =
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage ||
      languageConstants.DEFAULT_LOCALE;
    if (!languages.endonyms[preferredLanguage]) {
      preferredLanguage = preferredLanguage.split("-")[0];
    }
    let supportedLaguanges = this.props.config.supported_languages;
    if (!_.includes(supportedLaguanges, preferredLanguage)) {
      preferredLanguage = supportedLaguanges[0];
    }
    return (
      <span>
        <Select
          defaultValue={preferredLanguage}
          style={{
            width: 110,
            paddingTop: "20px"
          }}
          onChange={this.handleLanguageChangeLogin}
        >
          {_.map(
            Object.keys(languages.endonyms),

            function(locale, index) {
              return (
                _.includes(supportedLaguanges, locale) && (
                  <Option value={locale}>{languages.endonyms[locale]}</Option>
                )
              );
            }
          )}
        </Select>
      </span>
    );
  }
}

function mapStateToProps(state) {
  const { config, languageSelector, authentication } = state;
  const { user } = authentication;
  return {
    config,
    user,
    languageSelector
  };
}

export default connect(mapStateToProps)(LoginSelectLanguage);
