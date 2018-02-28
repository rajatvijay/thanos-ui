import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../login";
import Navbar from "../navbar";
import Workflow from "../workflow";
import WorkflowDetails from "../workflow-details";
import Users from "../users";
import "antd/dist/antd.css";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    loginUser: state.loginUser,
    user: state.user
  };
};

class MainRoutes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-container">
        <BrowserRouter>
          <div>
            <Navbar />
            <Switch>
              {/*<Route path="/" render={ ( props ) => ( props.location.pathname !== "/login") && <Navbar /> }/>*/}
              <Route path="/login" excat component={Login} />
              <Route path="/workflows" component={Workflow} />

              <Route path="/users/:id?" component={Users} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MainRoutes);
