import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl, authHeader, history } from "../../_helpers";
import WorkflowDetails from "./WorkflowDetails";
import { veryfiyClient } from "../../utils/verification";
import {
  logout,
  checkAuth,
  workflowDetailsActions,
  navbarActions,
  workflowActions
} from "../../actions";
//import { refetchWorkflowDetails } from "../../actions/workflow_details";

class WorkflowDetailsRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workflowId: null
    };
  }

  componentDidMount = () => {
    this.verifyAuth();
    const { workflowIdFromPropsForModal } = this.props;

    const WFId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);

    //set invalid true for sidebar on initial call
    if (this.props.match) {
      this.props.dispatch(
        workflowDetailsActions.setAsInvalidWorkflowDetails(WFId)
      );
    }

    this.setWorkflowId();
    this.setState({
      customHistory: [{ pathname: "/workflows/instances/", search: "" }]
    });

    if (!this.props.minimalUI) {
      this.props.dispatch(workflowActions.expandedWorkflowsList([]));
    }
  };

  componentDidUpdate = prevProps => {
    const { workflowIdFromPropsForModal, minimalUI } = this.props;
    console.log("comparing", prevProps, this.props);

    let WFId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);
    const { location } = this.props;

    //set invalid true for childWorkflows when we open them for full screen from workflowDetails page
    //sidebar data only only changes when workflowId changes (second check in if statement)
    //ansd we want to set invalid true when we are on screen not on minimal ui(first check in if statement)
    if (
      !minimalUI &&
      prevProps.match.params.id !== this.props.match.params.id
    ) {
      this.props.dispatch(
        workflowDetailsActions.setAsInvalidWorkflowDetails(WFId)
      );
    }

    this.setWorkflowId();

    //update custom history stack for back button purpose

    if (location.search && location.search !== prevProps.location.search) {
      if (location.pathname !== prevProps.location.pathname) {
        this.updateCustomHistory(location);
      } else {
        this.replaceLastHistory(location);
      }
    }
  };

  componentWillUnMount = () => {
    this.setState({ workflowId: null });
  };

  setWorkflowId = () => {
    const { workflowIdFromPropsForModal } = this.props;

    //if(!workflowIdFromPropsForModal){
    let WFId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);

    if (this.state.workflowId !== WFId) {
      this.setState({ workflowId: WFId }, () => {
        console.log("calling");
        this.fetchWorkflowData();
      });
      this.props.dispatch(navbarActions.showFilterMenu());
    }
    //}
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
    const { workflowId } = this.state;

    this.props.dispatch(workflowDetailsActions.getById(workflowId));

    if (
      !this.props.workflowDetails[workflowId] ||
      !this.props.workflowDetails[workflowId].workflowDetails
    ) {
      this.props.dispatch(workflowDetailsActions.getStepGroup(workflowId));
    } else if (
      this.props.workflowDetails[workflowId].invalid &&
      this.props.minimalUI
    ) {
      this.props.dispatch(workflowDetailsActions.getStepGroup(workflowId));
    }
  };

  updateCustomHistory = url => {
    let hist = this.state.customHistory;
    if (hist[hist.length - 1].pathname !== url.pathname) {
      hist.push(url);
      this.setState({ customHistory: hist });
    }
  };

  replaceLastHistory = url => {
    let hist = this.state.customHistory;
    let len = hist.length;
    hist[len - 1] = url;
    this.setState({ customHistory: hist });
  };

  removefromHistory = () => {
    let hist = this.state.customHistory;
    hist.pop();
    this.setState({ customHistory: hist });
  };

  goBack = () => {
    const { customHistory } = this.state;
    let len = customHistory.length,
      last = customHistory[len - 2],
      url = "";

    if (last) {
      url = last.pathname + last.search;
      history.push(url);
      this.removefromHistory();
    } else {
      let fam = this.props.workflowDetailsHeader.workflowDetailsHeader
        .workflow_family;
      let len = fam.length;

      if (fam.length > 1) {
        history.push(`/workflows/instances/${fam[len - 2].id}`);
      } else {
        history.push("/workflows/instances/");
      }
    }
  };

  render = () => {
    const { workflowId } = this.state;
    const { minimalUI, workflowIdFromPropsForModal } = this.props;
    if (workflowId) {
      return (
        <div>
          <WorkflowDetails
            workflowIdFromPropsForModal={workflowIdFromPropsForModal}
            minimalUI={minimalUI}
            workflowId={this.state.workflowId || null}
            goBack={this.goBack}
            {...this.props}
          />
        </div>
      );
    } else {
      return (
        <div className="text-center" style={{ marginTop: "100px" }}>
          loading...
        </div>
      );
    }
  };
}

function mapPropsToState(state) {
  const {
    authentication,
    users,
    workflowDetailsHeader,
    workflowDetails
  } = state;

  //Send to component
  return {
    workflowDetailsHeader,
    authentication,
    users,
    workflowDetails
  };
}

export default connect(mapPropsToState)(WorkflowDetailsRoot);
