import React from "react";
import { connect } from "react-redux";
import MagicLoginLinkForm from "./magic-form";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import { logout } from "../../actions";
import _ from "lodash";
import queryString from "query-string";

class MagicLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextUrl: ""
    };
  }

  render = () => {
    if (localStorage.getItem("user")) {
      let parsed = queryString.parse(this.props.location.search);
      if (parsed.next) {
        return <Redirect to={parsed.next} />;
      } else {
        return <Redirect to={"/workflows/instances/"} />;
      }
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
                <MagicLoginLinkForm
                  {...this.props}
                  nextUrl={this.state.nextUrl}
                />
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
