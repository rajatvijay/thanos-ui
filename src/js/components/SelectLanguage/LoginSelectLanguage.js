import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { languageActions } from "../../actions";
import languages from "../common/intlLanguages";
import { languageConstants } from "../../constants";
import { get as lodashGet } from "lodash";

const Option = Select.Option;

class LoginSelectLanguage extends React.Component {
  handleLanguageChangeLogin = value => {
    this.props.dispatch(languageActions.setLanguage(value));
  };

  get preferredLanguage() {
    return lodashGet(
      this.props,
      "authentication.user.prefered_language",
      languageConstants.DEFAULT_LOCALE
    );
  }

  renderLanguageName = languageSymbol => {
    const languageEndonym = languages.endonyms[languageSymbol];
    return languageEndonym
      ? `${languageSymbol}(${languageEndonym})`
      : languageSymbol;
  };

  render() {
    const { supported_languages: supportedLaguanges } = this.props.config;

    if (!supportedLaguanges) return null;
    return (
      <span>
        <Select
          defaultValue={this.preferredLanguage}
          style={{
            paddingTop: "20px",
            width: "180px"
          }}
          onChange={this.handleLanguageChangeLogin}
        >
          {supportedLaguanges.map(locale => (
            <Option key={locale} value={locale}>
              {this.renderLanguageName(locale)}
            </Option>
          ))}
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
