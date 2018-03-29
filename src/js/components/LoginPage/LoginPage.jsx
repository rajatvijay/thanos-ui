import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LoginForm from "./login-form";
import { userActions, logout } from "../../actions";
import "../../../css/section/login/login.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(logout());
  }

  render() {
    const { loggingIn } = this.props;
    return (
      <div className="login login-container container-fluid" id="login">
        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className="login-box ">
              <LoginForm {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
