import React from "react";
import { connect } from "react-redux";
import LoginSelectLanguage from "../SelectLanguage/LoginSelectLanguage";
import { FormattedMessage } from "react-intl";

const LoginHeader = props => {
  if (!props.config) {
    return <div className="login-header" />;
  } else {
    return (
      <div className="login-header">
        <div className="logo-container text-center">
          <div>
            {props.config.logo ? (
              <img className="logo" src={props.config.logo} alt="" />
            ) : (
              <span className="text-bold t-18">{props.config.name}</span>
            )}
          </div>
        </div>

        <div className="language-selection text-center mr-bottom-lg ">
          {props.showLanguage ? (
            <div>
              <span className="text-light t-14 pd-right-sm">
                <FormattedMessage id="loginPageInstances.selectPreferedLanguage" />
              </span>
              <LoginSelectLanguage />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const { config, languageSelector } = state;

  // languageSelector is here only to trigger re-render when the language is
  // changed, otherwise the text "Change language" doesn't reflect a change
  // because there's no change in props

  return {
    config: config,
    languageSelector
  };
}

export default connect(mapStateToProps)(LoginHeader);
