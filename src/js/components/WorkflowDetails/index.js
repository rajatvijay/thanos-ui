import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl, authHeader, history } from "../../_helpers";
import WorkflowDetails from "./WorkflowDetails";
import { veryfiyClient } from "../../utils/verification";
import {
  logout,
  checkAuth,
  workflowDetailsActions,
  navbarActions
} from "../../actions";
import _ from "lodash";

class WorkflowDetailsRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workflowId: null
    };
  }


  componentDidMount = () => {
    this.verifyAuth();
    this.setWorkflowId();
  };

  componentDidUpdate = pervProps => {
    let WFId = parseInt(this.props.match.params.id, 10);
    this.setWorkflowId();
  };

  componentWillUnMount = () => {
    this.setState({ workflowId: null });
  };

  setWorkflowId = () => {
    let WFId = parseInt(this.props.match.params.id, 10);
    if (this.state.workflowId !== WFId) {
      this.setState({ workflowId: WFId }, () => {
        this.fetchWorkflowData();
      });
      this.props.dispatch(navbarActions.showFilterMenu());
    }
  };


  verifyAuth = () => {
    if (!this.props.users.me) {
      this.props.dispatch(checkAuth());
    }
    if (!veryfiyClient(this.props.authentication.user.csrf)) {
      this.props.dispatch(logout());
    }
  };

  fetchWorkflowData = () => {
    //Get workflow  basic data
    this.props.dispatch(workflowDetailsActions.getById(this.state.workflowId));
    this.props.dispatch(
      workflowDetailsActions.getStepGroup(this.state.workflowId)
    );
  };

  render = () => {
    const { workflowId } = this.state;
    if (workflowId) {
      return (
        <WorkflowDetails
          workflowId={this.state.workflowId || null}
          {...this.props}
        />
      );
    } else {
      return (
        <div className="text-center">
          <br />
          <br />
          <br />
          <br />loading...
        </div>
      );
    }
  };
}

function mapPropsToState(state) {
  const { authentication, users } = state;

  //Send to component
  return {
    authentication,
    users
  };
}

export default connect(mapPropsToState)(WorkflowDetailsRoot);
