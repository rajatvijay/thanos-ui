import React from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import { languageActions } from "../actions";
import languages from "../intlLanguages";
import { languageConstants } from "../constants";
import { css } from "emotion";
import { FormattedMessage } from "react-intl";
import { get as lodashGet } from "lodash";

class SelectLanguage extends React.Component {
  handleLanguageChange = event => {
    const { title } = event.target;
    this.props.dispatch(languageActions.updateUserLanguage(title));
  };

  get preferredLanguage() {
    return lodashGet(
      this.props,
      "authentication.user.prefered_language",
      languageConstants.DEFAULT_LOCALE
    );
  }

  renderLanguageMenuTitle = () => {
    return (
      <span>
        <FormattedMessage id={"loginPageInstances.languageText"} />:{" "}
        <span style={{ textTransform: "uppercase" }}>
          {this.preferredLanguage}
        </span>
      </span>
    );
  };

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
      <Menu.SubMenu
        {...this.props}
        title={this.renderLanguageMenuTitle()}
        className="header-menu"
        onClick={this.handleLanguageChange}
      >
        <div style={{ height: "300px", overflow: "scroll" }}>
          {supportedLaguanges.map((language, index) => (
            <Menu.Item
              {...this.props}
              key={index}
              title={language}
              style={{ cursor: "pointer", padding: "10px" }}
              className={css`
                &:hover {
                  background-color: #eee !important;
                }
              `}
            >
              {this.renderLanguageName(language)}
            </Menu.Item>
          ))}
        </div>
      </Menu.SubMenu>
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
