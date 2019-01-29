import React from "react";
import { connect } from "react-redux";
import MagicLoginLinkForm from "./magic-form";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import { logout } from "../../actions";
import _ from "lodash";
import queryString from "query-string";
import LoginHeader from "./LoginHeader";

class MagicLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextUrl: ""
    };
  }

  componentDidMount = () => {
    this.processUrl();
  };

  processUrl = () => {
    const parsed = queryString.parse(this.props.location.search);

    if (parsed.next) {
      this.setState({ nextUrl: parsed.next });
    }
  };

  render = () => {
    if (localStorage.getItem("user")) {
      let parsed = queryString.parse(this.props.location.search);
      if (parsed.next) {
        return <Redirect to={parsed.next} />;
      } else {
        return <Redirect to={"/workflows/instances/"} />;
      }
    }

    let supportedLaguanges = this.props.config.supported_languages;
    

    return (
      <div className="login login-container container-fluid" id="login">

        <LoginHeader showLanguage={_.isEmpty(supportedLaguanges)?false:true}/>

        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div
              className={
                "login-box " + (this.props.config.saml_url ? "magic" : null)
              }
            >
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
  const { config } = state;
  const { emailAuth } = state.users;
  const { loading, error, submitted } = emailAuth;
  return {
    emailAuth: {
      loading,
      error,
      submitted
    },
    config: config
  };
}

const connectedLoginPage = connect(mapStateToProps)(MagicLoginPage);
export { connectedLoginPage as MagicLoginPage };
