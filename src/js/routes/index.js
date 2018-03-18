import React from "react";
import {
  BrowserRouter,
  Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import { history } from "../_helpers";
import { alertActions } from "../actions";
import { PrivateRoute } from "../components/PrivateRoute";
import { HomePage } from "../components/HomePage";
import { LoginPage } from "../components/LoginPage";
import { RegisterPage } from "../components/RegisterPage";

import Login from "../components/login";
import Navbar from "../components/navbar";
import Workflow from "../components/workflow";
import WorkflowDetails from "../components/workflow-details";
import Users from "../components/users";
import "antd/dist/antd.css";

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert
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
  }

  render() {
    const { alert } = this.props;
    return (
      <div className="main-container">
        {alert && alert.message ? (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        ) : null}

        <Router history={history}>
          <div>
            {localStorage.getItem("user") ? <Navbar /> : null}

            <Switch>
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />

              <Redirect from="/" exact to="/workflows/instances/" />
              <PrivateRoute path="/insight" exact component={HomePage} />
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
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MainRoutes);
//export default { connectedApp as MainRoutes };
