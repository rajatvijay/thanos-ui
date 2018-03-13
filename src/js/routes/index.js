import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../components/login";
import Navbar from "../components/navbar";
import Workflow from "../components/workflow";
import WorkflowDetails from "../components/workflow-details";
import Users from "../components/users";
import "antd/dist/antd.css";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    loginUser: state.loginUser
  };
};

class MainRoutes extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
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
              <Route path="/workflows/instances/" exact component={Workflow} />
              <Route
                path="/workflows/instances/:id?"
                component={WorkflowDetails}
              />
              <Route path="/users/:id?" component={Users} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MainRoutes);
