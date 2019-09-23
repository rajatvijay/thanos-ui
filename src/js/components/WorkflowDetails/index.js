import React, { Component } from "react";
import { connect } from "react-redux";
import { history } from "../../_helpers";
import WorkflowDetails from "./WorkflowDetails";
import { veryfiyClient } from "../../utils/verification";
import {
  logout,
  checkAuth,
  navbarActions,
  workflowActions
} from "../../actions";

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
    this.setState({
      customHistory: [{ pathname: "/workflows/instances/", search: "" }]
    });

    if (!this.props.minimalUI) {
      this.props.dispatch(workflowActions.expandedWorkflowsList([]));
    }
  };

  componentDidUpdate = prevProps => {
    const { location } = this.props;
    this.setWorkflowId();

    //update custom history stack for back button purpose

    if (location.search && location.search !== prevProps.location.search) {
      if (location.pathname !== prevProps.location.pathname) {
        this.updateCustomHistory(location);
      } else {
        this.replaceLastHistory(location);
      }
    }

    const { workflowItem, extraFilters } = this.props;

    //LOOK FOR EXTRA FILTERS PASSED ON BY PARENT
    //IF EXTRA FILTER IS AVAILABLE IN PROPS BUT
    //NOT IN REDUX STATE THEN DISPATCH TO UPDATE THE FILTER

    //NOTE: FIELDEXTRAFILTER CAN BE AVAILABLE FOR
    //THE CURRENT FIELD AS WE BUT WE ARE LOOKING FOR
    //EXTRA FILTER PASSED ON BY PARENT
    const hasNotUpdatedExtraFilters =
      this.props.fieldExtra && workflowItem && !extraFilters[workflowItem.id];

    if (hasNotUpdatedExtraFilters) {
      this.props.dispatch(
        workflowActions.updateParentExtraFilters(
          this.props.fieldExtra,
          workflowItem.id
        )
      );
    }
  };

  componentWillUnMount = () => {
    this.setState({ workflowId: null });
  };

  setWorkflowId = () => {
    const { workflowIdFromPropsForModal } = this.props;
    const WFId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);
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
    // const { workflowId } = this.state;
    //
    // this.props.dispatch(workflowDetailsActions.getById(workflowId));
    // this.props.dispatch(workflowDetailsActions.getStepGroup(workflowId));
  };

  updateCustomHistory = url => {
    const hist = this.state.customHistory;
    if (hist[hist.length - 1].pathname !== url.pathname) {
      hist.push(url);
      this.setState({ customHistory: hist });
    }
  };

  replaceLastHistory = url => {
    const hist = this.state.customHistory;
    const len = hist.length;
    hist[len - 1] = url;
    this.setState({ customHistory: hist });
  };

  removefromHistory = () => {
    const hist = this.state.customHistory;
    hist.pop();
    this.setState({ customHistory: hist });
  };

  goBack = () => {
    const { customHistory } = this.state;
    const len = customHistory.length;
    const last = customHistory[len - 2];
    let url = "";

    if (last) {
      url = last.pathname + last.search;
      history.push(url);
      this.removefromHistory();
    } else {
      const fam = this.props.workflowDetailsHeader.workflowDetailsHeader
        .workflow_family;
      const len = fam.length;

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
    workflowDetails,
    extraFilters
  } = state;

  //Send to component
  return {
    workflowDetailsHeader,
    authentication,
    users,
    workflowDetails,
    extraFilters
  };
}

export default connect(mapPropsToState)(WorkflowDetailsRoot);
