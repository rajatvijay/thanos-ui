import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
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
  handleLanguageChangeLogin = value => {
    this.props.dispatch(languageActions.updateUserLanguage(value));
  };
  render() {
    let user = this.props.authentication.user;
    let preferredLanguage =
      (user && user.prefered_language) || languageConstants.DEFAULT_LOCALE;
    return (
      <span>
        <Select
          defaultValue={preferredLanguage}
          style={{
            width: 110,
            paddingTop: "20px",
            float: this.props.navbar ? "right" : "",
            lineHeight: this.props.navbar ? "62px" : ""
          }}
          onChange={this.handleLanguageChange}
        >
          {_.map(
            Object.keys(languages.endonyms),

            function(locale, index) {
              return (
                <Option value={locale}>{languages.endonyms[locale]}</Option>
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
