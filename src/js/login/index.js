import React, { Component } from "react";
import LoginForm from "./login-form";
import { withRouter } from "react-router-dom";
//import bindActionCreators from "redux";
import { connect } from "react-redux";
//import { userLogin, login } from "./actions-login";
import "../../css/section/login/login.css";

const mapStateToProps = state => {
  return {
    loginUser: state.loginUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLogin: user =>
      dispatch({
        type: "LOGIN"
      })
  };
};

class Login extends Component {
  constructor(props) {
    super(props);
  }

  // submit = data =>{
  //   this.props.login(data).then( ()=>this.props.history.push("/") );
  // }

  render() {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
//export default withRouter(connect({login})(Login));
