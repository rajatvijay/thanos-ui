import React from "react";
import { connect } from "react-redux";
import LoginForm from "./login-form";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {};

  render = () => {
    if (localStorage.getItem("user")) {
      return <Redirect to={"/workflows/instances/"} />;
    }

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
  };
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
