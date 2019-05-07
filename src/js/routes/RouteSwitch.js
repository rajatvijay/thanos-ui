import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router";

import { connect } from "react-redux";
import { history } from "../_helpers";

import { PrivateRoute } from "../components/PrivateRoute";
import { GenericNotFound } from "../components/notfound";
import { LoginPage } from "../components/LoginPage";
import { MagicLogin } from "../components/LoginPage/MagicLogin";
import { OTPLogin } from "../components/LoginPage/OTPLogin";
import { RegisterPage } from "../components/RegisterPage";
import Navbar from "../components/Navbar";
import Workflow from "../components/Workflow";
import WorkflowDetailsRoot from "../components/WorkflowDetails";
import { MagicLinkProcess } from "../components/LoginPage/MagicLinkProcess";
import HeaderView from "../../modules/header/components/index";
import { injectIntl } from "react-intl";
import _ from "lodash";

class RoutSwitch extends React.Component {
  constructor(props) {
    super();
  }

  componentDidMount = () => {};

  componentDidUpdate = prevProps => {
    if (this.props.location !== prevProps.location) {
      this.calculateNav(prevProps);
    }
  };

  calculateNav = prevProps => {
    let customHistory = JSON.parse(localStorage.getItem("customHistory"));

    const { location } = this.props;
    const prevLocation = prevProps.location;

    let currentId = this.getIdFromPath(location.pathname);
    let prevId = this.getIdFromPath(prevLocation.pathname);

    if (
      location.pathname === "/workflows/instances/" ||
      location.pathname === "/workflows/instances"
    ) {
      this.setInitialHistoryState();
    }

    if (prevId && currentId && prevId !== currentId) {
      if (this.doesPathExists(customHistory, currentId)) {
        this.removeFromCustomHisotry();
      } else {
        let histObj = {
          id: prevId,
          pathname: prevProps.location.pathname,
          search: prevProps.location.search
        };
        this.pushToCustomHisotry(histObj);
      }
    }
  };

  setInitialHistoryState = () => {
    let customHistory = [
      { id: null, pathname: "/workflows/instances/", search: "" }
    ];
    localStorage.setItem("customHistory", JSON.stringify(customHistory));
  };

  getIdFromPath = path => {
    let pathArray = path.split("/");
    let id = pathArray[3];
    return id;
  };

  doesPathExists = (hist, id) => {
    let exists = false;
    _.forEach(hist, item => {
      if (item.id === id) {
        exists = true;
        return;
      }
    });
    return exists;
  };

  pushToCustomHisotry = item => {
    let arr = JSON.parse(localStorage.getItem("customHistory"));
    arr.push(item);
    localStorage.setItem("customHistory", JSON.stringify(arr));
  };

  removeFromCustomHisotry = item => {
    let arr = JSON.parse(localStorage.getItem("customHistory"));
    arr.splice(arr.length - 1, 1);
    localStorage.setItem("customHistory", JSON.stringify(arr));
  };

  render() {
    const { alert, nextUrl } = this.props;

    return (
      <Switch>
        <Route path="/login" exact component={OTPLogin} />
        <Route path="/login/basic" exact component={LoginPage} />
        <Route path="/login/magic" exact component={MagicLogin} />
        <Route path="/login/header" component={HeaderView} />
        <Route path="/login/magicprocess" component={MagicLinkProcess} />
        {this.props.nextUrl.url && localStorage.getItem("user") ? (
          <Redirect from="/" exact to={this.props.nextUrl.url} />
        ) : (
          <Redirect from="/" exact to="/workflows/instances/" />
        )}

        <PrivateRoute path="/workflows/instances/" exact component={Workflow} />

        <PrivateRoute
          path="/workflows/instances/:id?/"
          component={WorkflowDetailsRoot}
        />

        <Route path="/" component={GenericNotFound} />
      </Switch>
    );
  }
}

export default withRouter(RoutSwitch);
