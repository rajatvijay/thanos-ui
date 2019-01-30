import React from "react";
import { connect } from "react-redux";
import { Select, Tooltip } from "antd";
import { languageActions } from "../../actions";
import _ from "lodash";
import languages from "../common/intlLanguages";
import { languageConstants } from "../../constants";

const Option = Select.Option;

class LoginSelectLanguage extends React.Component {
  handleLanguageChangeLogin = value => {
    this.props.dispatch(languageActions.setLanguage(value));
  };
  render() {
    let preferredLanguage =
      this.props.languageSelector.language ||
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
            paddingTop: "20px"
          }}
          onChange={this.handleLanguageChangeLogin}
        >
          {_.map(
            Object.keys(languages.endonyms),

            function(locale, index) {
              return (
                _.includes(supportedLaguanges, locale) && (
                  <Option value={locale}>
                    {/*
                  <Tooltip title={languages.endonyms[locale]} placement="leftTop">
                    <span>
                      <span class={"flag flag-" + locale} title={languages.endonyms[locale]}></span>
                    </span>
                  </Tooltip>
                    */}
                    {languages.endonyms[locale]}
                  </Option>
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
