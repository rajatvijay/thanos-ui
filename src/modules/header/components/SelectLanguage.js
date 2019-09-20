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
    const { title } = event.item.props;
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

  get sanitizedProps() {
    const otherProps = { ...this.props };
    delete otherProps.authentication;
    delete otherProps.dispatch;
    delete otherProps.config;
    return otherProps;
  }

  render() {
    const { supported_languages: supportedLaguanges } = this.props.config;
    if (!supportedLaguanges) return null;
    const sanitizedProps = this.sanitizedProps;
    return (
      <Menu.SubMenu
        {...sanitizedProps}
        title={this.renderLanguageMenuTitle()}
        className="header-menu"
        onClick={this.handleLanguageChange}
      >
        {supportedLaguanges.map(language => (
          <Menu.Item
            {...sanitizedProps}
            key={language}
            title={language}
            className={css`
              cursor: pointer;
              padding: 10px;
              &:hover {
                background-color: #eee !important;
              }
            `}
          >
            {this.renderLanguageName(language)}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    );
  }
}

function mapStateToProps(state) {
  const { config, authentication } = state;
  return {
    config,
    authentication
  };
}

export default connect(mapStateToProps)(SelectLanguage);
