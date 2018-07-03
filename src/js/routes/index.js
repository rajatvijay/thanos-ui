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
import { alertActions, configActions } from "../actions";
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
  const { alert, config } = state;
  return {
    alert,
    config
  };
}

class MainRoutes extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
    dispatch(configActions.getConfig());
  }

  render() {
    const { alert } = this.props;
    return (
      <div className="main-container">
        <div className="error" style={{ position: "relative", zIndex: 111 }}>
          {alert && alert.message ? (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          ) : null}
        </div>

        <Router history={history}>
          <div>
            {localStorage.getItem("user") ||
            !history.location.pathname === "/login" ? (
              <Navbar />
            ) : null}

            <Switch>
              <Route path="/login" exact component={LoginPage} />
              <Route path="/login/magic" exact component={MagicLoginPage} />
              <Route path="/register" exact component={RegisterPage} />

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
              <PrivateRoute path="/export-list" component={ExportList} />

              <Route path="/" component={GenericNotFound} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MainRoutes);
//export default { connectedApp as MainRoutes };
