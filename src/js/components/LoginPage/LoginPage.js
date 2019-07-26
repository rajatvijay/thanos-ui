import React from "react";
import { connect } from "react-redux";
import LoginForm from "./LoginForm";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import _ from "lodash";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { token: null };
  }

  componentDidMount = () => {};

  verifyCallback = recaptchaToken => {
    // Here you will get the final recaptchaToken!!!
    this.setState({ token: recaptchaToken });
  };

  render = () => {
    const supportedLaguanges = this.props.config.supported_languages;

    if (this.props.config.configuration) {
      if (
        !_.includes(this.props.config.configuration.client_auth_backends, 0)
      ) {
        return <Redirect to={"/"} />;
      }
    }

    if (localStorage.getItem("user")) {
      return <Redirect to={"/workflows/instances/"} />;
    }

    return (
      <div
        className="login login-container container-fluid"
        id="login"
        token={this.state.token}
      >
        <LoginHeader
          showLanguage={_.isEmpty(supportedLaguanges) ? false : true}
        />
        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className="login-box ">
              {this.props.loggingIn ? (
                <div className="text-center mr-top-lg">
                  <Icon type="loading" style={{ fontSize: 24 }} />
                </div>
              ) : (
                <LoginForm {...this.props} token={this.state.token} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { loggingIn, error } = state.authentication;
  const { config } = state;
  return {
    loggingIn,
    error,
    config
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
