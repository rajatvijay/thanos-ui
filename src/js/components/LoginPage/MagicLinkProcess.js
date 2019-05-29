import React from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
import _ from "lodash";
import "../../../css/section/login/login.css";
import { Redirect } from "react-router-dom";
import { tokenLogin } from "../../actions";
import queryString from "query-string";
import MagicLinkRedirect from "../notfound/MagicLinkRedirect";

class MagicLinkProcess extends React.Component {
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

    if (parsed.token) {
      let token = parsed.token;
      let next = parsed.next ? parsed.next : "";
      this.tokenLoginRequest(token, next);
    }
  };

  tokenLoginRequest = (token, next) => {
    const { dispatch } = this.props;
    if (token) {
      dispatch(tokenLogin(token, next));
    }
  };

  onMagicLogin = () => {
    localStorage.setItem("magicLogin", "true");
  };

  render = () => {
    if (localStorage.getItem("user")) {
      if (this.state.nextUrl) {
        this.onMagicLogin();

        return <Redirect to={this.state.nextUrl} />;
      } else {
        return <Redirect to={"/workflows/instances/"} />;
      }
    }

    if (this.props.error) {
      return <MagicLinkRedirect />;
    }

    return (
      <div className="login login-container container-fluid" id="login">
        <div className="login-overlay">
          <div className="d-flex justify-content-center align-items-center">
            <div className="login-box ">
              <div>
                <Icon type="loading" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { loggingIn, error } = state.authentication;
  return {
    loggingIn,
    error
  };
}

const connectedLoginPage = connect(mapStateToProps)(MagicLinkProcess);
export { connectedLoginPage as MagicLinkProcess };

// export default MagicLinkProcess ;
