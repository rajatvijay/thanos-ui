import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LoginForm from "./login-form";
import { Icon } from "antd";
import { userActions, logout } from "../../actions";
import "../../../css/section/login/login.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loggingIn } = this.props;
    return (
      <div className="login login-container container-fluid" id="login">
        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className="login-box ">
              {this.props.loggingIn ? (
                <div className="text-center mr-top-lg">
                  <Icon type="loading" style={{ fontSize: 24 }} />
                </div>
              ) : (
                <LoginForm {...this.props} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
