import React from "react";
import { connect } from "react-redux";
import OTPForm from "./OTPForm";
import { Icon } from "antd";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import _ from "lodash";
import queryString from "query-string";
import LoginHeader from "./LoginHeader";
import Godaam from "../../utils/storage";

class OTPLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextUrl: ""
    };
  }

  componentDidMount = () => {};

  processUrl = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.next) {
      this.setState({ nextUrl: parsed.next });
    }
  };

  render = () => {
    const config = this.props.config;
    let showRightBlock = true;
    const supportedLaguanges = config.supported_languages;

    const parsed = queryString.parse(this.props.location.search);

    if (Godaam.user) {
      if (this.props.location.state && this.props.location.state.from) {
        return <Redirect to={this.props.location.state.from} />;
      } else if (parsed.next) {
        return <Redirect to={parsed.next} />;
      } else {
        return (
          <Redirect
            to={"/workflows/instances/"}
            from={this.props.location.pathname}
          />
        );
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
                <OTPForm {...this.props} showRightBlock={showRightBlock} />
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
