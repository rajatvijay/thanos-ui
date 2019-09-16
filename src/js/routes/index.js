import React from "react";
import { Router } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "../_helpers";
import _ from "lodash";
import { configActions, userActions, checkAuth } from "../actions";
import Header from "../../modules/header/components";
import "antd/dist/antd.css";
import { injectIntl } from "react-intl";
import queryString from "query-string";
import RouteSwitch from "./RouteSwitch";
import Godaam from "../utils/storage";
import { permissionActions } from "../../modules/common/permissions/actions";

function mapStateToProps(state) {
  const { config, users, languageSelector, nextUrl, permissions } = state;
  return {
    users,
    config,
    nextUrl,
    languageSelector,
    permissions
  };
}

class MainRoutes extends React.Component {
  constructor(props) {
    super();
    let browserMessage, ieDetected;
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/ false || !!document.documentMode;
    if (isIE) {
      browserMessage = `Our website is not supported by Internet Explorer. If you are recurrently experiencing an "expired link" error, please try logging into the portal again using Google Chrome or Safari.`;
      ieDetected = true;
    } else {
      browserMessage = "";
      ieDetected = false;
    }
    this.state = {
      showBlank: true,
      browserMessage,
      ieDetected
    };
  }

  componentDidMount = () => {
    const host = document.location.hostname.split(".");

    if (host[0] === "certa" || host[0] === "slackcart") {
      window.location = "https://www.thevetted.com";
    } else {
      this.setState({ showBlank: false });
      this.props.dispatch(checkAuth());
      this.props.dispatch(configActions.getConfig());
    }

    const parsed = queryString.parse(history.location.search);
    if (parsed.next) {
      this.props.dispatch(userActions.setNextUrl(parsed.next));
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.config.name !== prevProps.config.name) {
      document.title = _.upperFirst(this.props.config.name) || "Vetted";
    }

    if (
      Godaam.user &&
      !this.props.permissions.loading &&
      !Object.keys(this.props.permissions.permissions).length
    ) {
      this.props.dispatch(permissionActions.getPermissions());
    }
  }

  componentWillReceiveProps(nextProps) {
    document.title = _.upperFirst(this.props.config.name) || "Vetted";
  }

  render() {
    const { users } = this.props;

    if (this.state.showBlank) {
      return <div />;
    } else {
      return (
        <div className="main-container">
          {this.state.ieDetected ? (
            <div className="text-center mr-top-lg t-22">
              {this.state.browserMessage}
            </div>
          ) : (
            <Router history={history}>
              {users.me && users.me.loading ? (
                <div className="text-center mr-top-lg">loading...</div>
              ) : (
                <div>
                  {Godaam.user ||
                  !_.includes(history.location.pathname, "/login") ? (
                    <Header />
                  ) : null}
                  <RouteSwitch {...this.props} />
                </div>
              )}
            </Router>
          )}
        </div>
      );
    }
  }
}

export default injectIntl(connect(mapStateToProps)(MainRoutes));
