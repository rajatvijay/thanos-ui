import React from "react";
import { connect } from "react-redux";
import LoginLinkForm from "./magic-form";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import { logout } from "../../actions";

class MagicLoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    //this.props.dispatch(logout());
  };

  render = () => {
    if (localStorage.getItem("user")) {
      return <Redirect to={"/workflows/instances/"} />;
    }

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
                <LoginLinkForm {...this.props} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
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
