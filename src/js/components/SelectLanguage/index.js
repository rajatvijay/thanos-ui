import React from "react";
import { connect } from "react-redux";
import { Select, Tooltip } from "antd";
import { languageActions } from "../../actions";
import _ from "lodash";
import languages from "../common/intlLanguages";
import { languageConstants } from "../../constants";

const Option = Select.Option;

class SelectLanguage extends React.Component {
  handleLanguageChange = value => {
    if (this.props.authentication.user) {
      this.props.dispatch(languageActions.updateUserLanguage(value));
    }
    window.location.reload();
  };
  render() {
    let user = this.props.authentication.user;
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
    let supportedLaguanges = this.props.config.supported_languages;
    if (!_.includes(supportedLaguanges, preferredLanguage)) {
      preferredLanguage = supportedLaguanges[0];
    }
    return (
      <span>
        <Select
          defaultValue={preferredLanguage}
          style={{
            paddingTop: "20px",
            float: this.props.navbar ? "right" : "",
            lineHeight: this.props.navbar ? "62px" : ""
          }}
          onChange={this.handleLanguageChange}
        >
          {_.map(
            Object.keys(languages.endonyms),

            function(locale, index) {
              console.log("locale---");
              console.log(locale);

              return (
                _.includes(supportedLaguanges, locale) && (
                  <Option value={locale}>
                    <Tooltip
                      title={languages.endonyms[locale]}
                      placement="leftTop"
                    >
                      <span className="f16">
                        <span
                          className={"flag " + locale}
                          title={languages.endonyms[locale]}
                        />
                      </span>{" "}
                      {locale}
                    </Tooltip>
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
  const { config, authentication, languageSelector } = state;
  return {
    config,
    authentication,
    languageSelector
  };
}

export default connect(mapStateToProps)(SelectLanguage);
