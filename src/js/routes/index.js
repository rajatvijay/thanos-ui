import React from "react";
import {
  //BrowserRouter,
  Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import { history } from "../_helpers";
import _ from "lodash";
import {
  alertActions,
  configActions,
  userActions,
  checkAuth
} from "../actions";
import { PrivateRoute } from "../components/PrivateRoute";
import { GenericNotFound } from "../components/notfound";
import Logout from "../components/LoginPage/Logout";
import { LoginPage } from "../components/LoginPage";
import { MagicLogin } from "../components/LoginPage/MagicLogin";
import { OTPLogin } from "../components/LoginPage/OTPLogin";
import { RegisterPage } from "../components/RegisterPage";
import Navbar from "../components/Navbar";
import Workflow from "../components/Workflow";
import WorkflowDetails from "../components/WorkflowDetails";
import { MagicLinkProcess } from "../components/LoginPage/MagicLinkProcess";
import Users from "../components/Users";
import ExportList from "../components/ExportPage";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "antd/dist/antd.css";
import { injectIntl } from "react-intl";
import queryString from "query-string";
import SidebarView from "../../modules/workflows/sidebar/components";

function mapStateToProps(state) {
  const { config, users, languageSelector, nextUrl } = state;
  return {
    users,
    config,
    nextUrl,
    languageSelector
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
    //if (!localStorage.getItem("user")) {

    let host = document.location.hostname.split(".");

    if (host[0] === "certa" || host[0] === "slackcart") {
      window.location = "https://www.thevetted.com";
    } else {
      this.setState({ showBlank: false });
      this.props.dispatch(checkAuth());
      this.props.dispatch(configActions.getConfig());
    }
    //}

    let parsed = queryString.parse(history.location.search);
    if (parsed.next) {
      this.props.dispatch(userActions.setNextUrl(parsed.next));
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.config.name !== prevProps.config.name) {
      document.title = _.upperFirst(this.props.config.name) || "Vetted";
    }
  }
  componentWillReceiveProps(nextProps) {
    document.title = _.upperFirst(this.props.config.name) || "Vetted";
  }

  watchRouteChange = history.listen((location, action) => {
    // location is an object like window.location
    if (
      location.pathname === "/login/magic" ||
      location.pathname === "/login"
    ) {
      this.props.dispatch(checkAuth());
    }
  });

  render() {
    const { alert, nextUrl } = this.props;

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
              {this.props.users.me && this.props.users.me.loading ? (
                <div className="text-center mr-top-lg">loading...</div>
              ) : (
                <div>
                  {localStorage.getItem("user") ||
                  !_.includes(history.location.pathname, "/login") ? (
                    <Navbar />
                  ) : null}
                  <Switch>
                    <Route path="/login" exact component={OTPLogin} />
                    <Route path="/login/basic" exact component={LoginPage} />
                    <Route path="/login/magic" exact component={MagicLogin} />
                    <Route
                      path="/login/magicprocess"
                      component={MagicLinkProcess}
                    />
                    <Route path="/sidebar" exact component={SidebarView} />
                    {this.props.nextUrl.url && localStorage.getItem("user") ? (
                      <Redirect from="/" exact to={this.props.nextUrl.url} />
                    ) : (
                      <Redirect from="/" exact to="/workflows/instances/" />
                    )}

                    <PrivateRoute
                      path="/workflows/instances/"
                      exact
                      component={Workflow}
                    />

                    <PrivateRoute
                      path="/workflows/instances/:id?/"
                      component={WorkflowDetails}
                    />

                    <PrivateRoute path="/users/:id?" component={Users} />
                    {/*<PrivateRoute path="/export-list" component={ExportList} />*/}

                    <Route path="/" component={GenericNotFound} />
                  </Switch>
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
//export default { connectedApp as MainRoutes };
