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
import { LoginPage } from "../components/LoginPage";
import { MagicLoginPage } from "../components/LoginPage/MagicLinkPage";
import { RegisterPage } from "../components/RegisterPage";
import Navbar from "../components/Navbar";
import Workflow from "../components/Workflow";
import WorkflowDetails from "../components/WorkflowDetails";
import { MagicLinkProcess } from "../components/LoginPage/MagicLinkProcess";
import Users from "../components/Users";
import ExportList from "../components/ExportPage";
import "antd/dist/antd.css";
import messages from "../components/common/intlMessages";
import { addLocaleData, IntlProvider, injectIntl } from "react-intl";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import fr from "react-intl/locale-data/fr";
import { flattenMessages } from "../components/common/messageUtils";

addLocaleData([...en, ...es, ...fr]);

function mapStateToProps(state) {
  const { config, users, languageSelector } = state;
  return {
    users,
    config,
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
      browserMessage =
        "So sorry, but this website does not work on Internet Explorer yet. Please copy the URL and try open it in either Chrome, Firefox, Safari, Opera.";
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
  };

  // componentDidUpdate = prevProp => {
  //   if (this.props.users.me !=){

  //   }
  // }
  componentDidUpdate(prevProps) {
    if (this.props.config.name !== prevProps.config.name) {
      document.title = _.upperFirst(this.props.config.name) || "Vetted";
    }
  }
  componentWillReceiveProps(nextProps) {
    document.title = _.upperFirst(this.props.config.name) || "Vetted";
  }

  render() {
    let locale =
      this.props.languageSelector.language ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage ||
      "en-US";
    let messageTranslate = messages[locale] || messages["en-US"];

    console.log(this.props.languageSelector, "route language");
    const { alert } = this.props;
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
            <IntlProvider
              locale={locale}
              messages={flattenMessages(messageTranslate)}
            >
              <Router history={history}>
                {this.props.users.me && this.props.users.me.loading ? (
                  <div className="text-center mr-top-lg">loading...</div>
                ) : (
                  <div>
                    {localStorage.getItem("user") ||
                    !history.location.pathname === "/login/magic/" ? (
                      <Navbar />
                    ) : null}

                    <Switch>
                      <Route path="/login" exact component={LoginPage} />
                      <Route
                        path="/login/magic"
                        exact
                        component={MagicLoginPage}
                      />
                      <Route
                        path="/login/magicprocess"
                        component={MagicLinkProcess}
                      />

                      <Redirect from="/" exact to="/workflows/instances/" />

                      <PrivateRoute
                        path="/workflows/instances/"
                        exact
                        component={Workflow}
                      />
                      <PrivateRoute
                        path="/workflows/instances/:id?"
                        component={WorkflowDetails}
                      />
                      <PrivateRoute path="/users/:id?" component={Users} />
                      {/*<PrivateRoute path="/export-list" component={ExportList} />*/}

                      <Route path="/" component={GenericNotFound} />
                    </Switch>
                  </div>
                )}
              </Router>
            </IntlProvider>
          )}
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(MainRoutes);
//export default { connectedApp as MainRoutes };
