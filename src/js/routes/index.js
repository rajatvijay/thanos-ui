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
import Users from "../components/Users";
import ExportList from "../components/ExportPage";
import "antd/dist/antd.css";

function mapStateToProps(state) {
  const { config, users } = state;
  return {
    users,
    config
  };
}

class MainRoutes extends React.Component {
  componentDidMount = () => {
    //if (!localStorage.getItem("user")) {
    this.props.dispatch(checkAuth());
    this.props.dispatch(configActions.getConfig());
    //}
  };

  // componentDidUpdate = prevProp => {
  //   if (this.props.users.me !=){

  //   }
  // }

  render() {
    const { alert } = this.props;
    return (
      <div className="main-container">
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
                <Route path="/login/magic" exact component={MagicLoginPage} />

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
      </div>
    );
  }
}

export default connect(mapStateToProps)(MainRoutes);
//export default { connectedApp as MainRoutes };
