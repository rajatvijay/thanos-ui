import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";

import { PrivateRoute } from "../components/PrivateRoute";
import { GenericNotFound } from "../components/notfound";
import { LoginPage } from "../components/LoginPage";
import { MagicLogin } from "../components/LoginPage/MagicLogin";
import { OTPLogin } from "../components/LoginPage/OTPLogin";
import Workflow from "../components/Workflow";
import WorkflowDetailsRoot from "../components/WorkflowDetails";
import { MagicLinkProcess } from "../components/LoginPage/MagicLinkProcess";
import ReportPage from "../components/ReportPage";
import HeaderView from "../../modules/header/components/index";
import _ from "lodash";
import Godaam from "../utils/storage";
import queryString from "query-string";
import { userActions } from "../actions";
import { ServiceUnavailableError } from "../components/common/ServiceUnavailableError";

class RoutSwitch extends React.Component {
  componentDidUpdate = prevProps => {
    if (this.props.location !== prevProps.location) {
      const parsed = queryString.parse(this.props.location.search);
      if (parsed.next) {
        this.props.dispatch(userActions.setNextUrl(parsed.next));
      }
      this.calculateNav(prevProps);
    }
  };

  calculateNav = prevProps => {
    const customHistory = JSON.parse(Godaam.customHistory);

    const { location } = this.props;
    const prevLocation = prevProps.location;

    const currentId = this.getIdFromPath(location.pathname);
    const prevId = this.getIdFromPath(prevLocation.pathname);

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
        const histObj = {
          id: prevId,
          pathname: prevProps.location.pathname,
          search: prevProps.location.search
        };
        this.pushToCustomHisotry(histObj);
      }
    }
  };

  setInitialHistoryState = () => {
    const customHistory = [
      { id: null, pathname: "/workflows/instances/", search: "" }
    ];
    Godaam.customHistory = JSON.stringify(customHistory);
  };

  getIdFromPath = path => {
    const pathArray = path.split("/");
    const id = pathArray[3];
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
    const arr = JSON.parse(Godaam.customHistory) || [];
    arr.push(item);
    Godaam.customHistory = JSON.stringify(arr);
  };

  removeFromCustomHisotry = item => {
    const arr = JSON.parse(Godaam.customHistory);
    arr.splice(arr.length - 1, 1);
    Godaam.customHistory = JSON.stringify(arr);
  };

  render() {
    return (
      <Switch>
        <Route exact path="/login" component={OTPLogin} />
        <Route exact path="/login/basic" component={LoginPage} />
        <Route exact path="/login/magic" component={MagicLogin} />
        <Route exact path="/login/header" component={HeaderView} />
        <Route exact path="/login/magicprocess" component={MagicLinkProcess} />

        {this.props.nextUrl.url && Godaam.user ? (
          <Redirect from="/" exact to={this.props.nextUrl.url} />
        ) : (
          <Redirect
            from="/"
            exact
            to={
              this.props.nextUrl.url
                ? this.props.nextUrl.url
                : `/workflows/instances/`
            }
          />
        )}

        <PrivateRoute path="/workflows/instances/" exact component={Workflow} />

        <PrivateRoute
          path="/workflows/instances/:id?/"
          component={WorkflowDetailsRoot}
        />

        <PrivateRoute path="/reports/" exact component={ReportPage} />

        <Route
          path="/service-unavailable/"
          component={ServiceUnavailableError}
        />

        <Route path="/" component={GenericNotFound} />
      </Switch>
    );
  }
}

export default withRouter(RoutSwitch);
