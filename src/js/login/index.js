import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./login-form";
import "../../css/section/login/login.css";

class Login extends Component {
  render() {
    return (
      <div className="login login-container container-fluid" id="login">
        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className="login-box ">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default () => <Login />;
