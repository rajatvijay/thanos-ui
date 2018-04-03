import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LoginForm from "./magic-form";
import { Icon } from "antd";
import "../../../css/section/login/login.css";

class MagicLoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading } = this.props;
    return (
      <div className="login login-container container-fluid" id="login">
        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className="login-box ">
              {this.props.emailAuth.loading ? (
                <div>
                  <Icon type="loading" />
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
  const { emailAuth } = state.users;
  const { loading, error, submitted } = emailAuth;
  return {
    emailAuth: {
      loading,
      error,
      submitted
    }
  };
}

const connectedLoginPage = connect(mapStateToProps)(MagicLoginPage);
export { connectedLoginPage as MagicLoginPage };
