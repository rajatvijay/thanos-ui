import React from "react";
import { connect } from "react-redux";
import OTPForm from "./OTPForm";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import { logout } from "../../actions";
import _ from "lodash";
import queryString from "query-string";
import LoginHeader from "./LoginHeader";

class OTPLogin extends React.Component {
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
    const config = this.props.config;
    let showRightBlock = true;
    let supportedLaguanges = config.supported_languages;

    if (localStorage.getItem("user")) {
      let parsed = queryString.parse(this.props.location.search);
      if (parsed.next) {
        return <Redirect to={parsed.next} />;
      } else {
        return <Redirect to={"/workflows/instances/"} />;
      }
    }

    if (
      !config.saml_url &&
      config.configuration &&
      !_.includes(config.configuration.client_auth_backends, 0)
    ) {
      showRightBlock = false;
    }

    return (
      <div className="login login-container container-fluid" id="login">
        <LoginHeader
          showLanguage={_.isEmpty(supportedLaguanges) ? false : true}
        />

        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className={"login-box " + (showRightBlock && " magic")}>
              {this.props.emailAuth.loading ? (
                <div>
                  <Icon type="loading" />
                </div>
              ) : (
                <OTPForm
                  {...this.props}
                  showRightBlock={showRightBlock}
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

const connectedLoginPage = connect(mapStateToProps)(OTPLogin);
export { connectedLoginPage as OTPLogin };
