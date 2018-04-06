import React from "react";
import { connect } from "react-redux";
import LoginForm from "./login-form";
import { Icon } from "antd";
import "../../../css/section/login/login.css";

const LoginPage = props => {
  return (
    <div className="login login-container container-fluid" id="login">
      <div className="login-overlay">
        <div className="d-flex justify-content-center align-items-center">
          <div className="login-box ">
            {props.loggingIn ? (
              <div className="text-center mr-top-lg">
                <Icon type="loading" style={{ fontSize: 24 }} />
              </div>
            ) : (
              <LoginForm {...props} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  const { alert } = state;
  return {
    loggingIn,
    alert
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
