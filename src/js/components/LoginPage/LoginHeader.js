import React from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
import SelectLanguage from "../SelectLanguage/";
import LoginSelectLanguage from "../SelectLanguage/LoginSelectLanguage";
import { FormattedMessage, injectIntl } from "react-intl";

const LoginHeader = props => {
  if (!props.config) {
    return <div className="login-header" />;
  } else {
    return (
      <div className="login-header">
        <div className="logo-container text-center">
          <div>
            {props.config.logo ? (
              <img className="logo" src={props.config.logo} />
            ) : (
              <span className="text-bold t-18">{props.config.name}</span>
            )}
          </div>
          {/* <span className="logo-subtext">PARTNERS</span> */}
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
  const { config } = state;
  return {
    config: config
  };
}

export default connect(mapStateToProps)(LoginHeader);
