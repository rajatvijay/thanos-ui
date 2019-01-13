import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
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
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage ||
      languageConstants.DEFAULT_LOCALE;
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
  const { config, languageSelector, authentication } = state;
  const { user } = authentication;
  return {
    config,
    user,
    languageSelector
  };
}

export default connect(mapStateToProps)(LoginSelectLanguage);
