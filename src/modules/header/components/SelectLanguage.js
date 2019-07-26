import React from "react";
import { connect } from "react-redux";
import { Select, Tooltip } from "antd";
import { languageActions } from "../actions";
import _ from "lodash";
import languages from "../intlLanguages";
import { languageConstants } from "../constants";

const Option = Select.Option;

class SelectLanguage extends React.Component {
  handleLanguageChange = value => {
    if (this.props.authentication.user) {
      this.props.dispatch(languageActions.updateUserLanguage(value));
    }
  };
  render() {
    if (this.props.languageSelector.loading) {
      console.log(`Language change in progress, will need reload`);
      this.languageChangeInprogress = true;
    } else if (this.languageChangeInprogress) {
      console.log(`Language change done, will reload`);
      window.location.reload();
    }
    const user = this.props.authentication.user;
    let preferredLanguage =
      this.props.languageSelector.language ||
      (user && user.prefered_language) ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage ||
      languageConstants.DEFAULT_LOCALE;
    if (!languages.endonyms[preferredLanguage]) {
      preferredLanguage = preferredLanguage.split("-")[0];
    }
    const supportedLaguanges = this.props.config.supported_languages;
    if (!_.includes(supportedLaguanges, preferredLanguage)) {
      preferredLanguage = supportedLaguanges[0];
    }
    return (
      <span>
        <Select
          defaultValue={preferredLanguage}
          className="nav-lang-select"
          onChange={this.handleLanguageChange}
          style={{
            width: "80px"
          }}
        >
          {_.map(Object.keys(languages.endonyms), function(locale, index) {
            return _.includes(supportedLaguanges, locale) ? (
              <Option key={`option_${locale}`} value={locale}>
                <Tooltip title={languages.endonyms[locale]} placement="leftTop">
                  <span
                    style={{
                      textTransform: "uppercase",
                      opacity: 0.3,
                      color: "#000000",
                      fontSize: "16px",
                      letterSpacing: "-0.03px",
                      textAlign: "right"
                    }}
                  >
                    {locale}
                  </span>
                </Tooltip>
              </Option>
            ) : null;
          })}
        </Select>
      </span>
    );
  }
}

function mapStateToProps(state) {
  const { config, authentication, languageSelector } = state;
  return {
    config,
    authentication,
    languageSelector
  };
}

export default connect(mapStateToProps)(SelectLanguage);
