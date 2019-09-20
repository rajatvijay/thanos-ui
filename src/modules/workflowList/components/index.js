import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Layout
  // Icon, Row
} from "antd";
// import WorkflowList from "./workflow-list";
import {
  // workflowActions,
  workflowFiltersActions,
  // logout,
  checkAuth
  // workflowKindActions,
  // configActions
} from "../../../js/actions";
// import _ from "lodash";
// import { veryfiyClient } from "../../../js/utils/verification";
import { FormattedMessage, injectIntl } from "react-intl";
// import Sidebar from "../sidebar/components/Sidebar";
// import Filter from "../filters/components/Filter";
import { Chowkidaar } from "../../common/permissions/Chowkidaar";
import Permissions from "../../common/permissions/permissionsList";
import { css } from "emotion";
import WorkflowToolbar from "../filters/components/WorkflowSorter";

const { Content } = Layout;

class Workflow extends Component {
  state = {
    sidebar: false,
    workflowId: null,
    showWaitingFitler: false,
    statusView: true,
    visible: false,
    sortOrderAsc: false,
    sortingEnabled: false
  };
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     sidebar: false,
  //     workflowId: null,
  //     showWaitingFitler: false,
  //     statusView: true,
  //     visible: false,
  //     sortOrderAsc: false,
  //     sortingEnabled: false
  //   };

  // TODO: Check is this is required
  //   // RWR: allow it for only auth users
  //   if (!this.props.users.me) {
  //     this.checkAuth();
  //   }

  // TODO: Check is this is required
  //   // RWR: Not sure what this is for?
  //   if (!this.props.users.me || this.props.users.me.error) {
  //     if (!veryfiyClient(this.props.authentication.user.csrf)) {
  //       this.props.dispatch(logout());
  //     }
  //   }
  // }

  componentDidMount = () => {
    // TODO: Move them into the Filters action
    // this.props.dispatch(workflowKindActions.getAll());
    // // RWR: Get all the status data for the for filter
    // this.props.dispatch(workflowFiltersActions.getStatusData());
    // // RWR: Get all the region data for the for filter
    // this.props.dispatch(workflowFiltersActions.getRegionData());
    // // RWR: Get all the business data for the for filter
    // this.props.dispatch(workflowFiltersActions.getBusinessUnitData());
    // TODO: Check is this is required
    // RWR: What this is for?
    // if (!_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
    //   this.setState({ defKind: true });
    // }
    // TODO: Move this to Filter sidebar
    // RWR: Choose the default kind and get stepgroupdefs(task queues) and alerts on the basis of that
    // if (this.props.workflowKind.workflowKind) {
    //   this.getDefaultKind();
    // }
    // TODO: Check is this is required
    // RWR: If there is no config, get config. Not sure why this is required here
    // if (!this.props.config.configuration || this.props.config.error) {
    //   this.props.dispatch(configActions.getConfig());
    // }
  };

  componentDidUpdate = prevProps => {
    // TODO: Move this to the Filter component
    // RWR: Apply filters when the ser filters changes
    // if (this.props.workflowFilters !== prevProps.workflowFilters) {
    //   this.props.dispatch(workflowActions.getAll());
    // }
    // TODO: Check is this is required
    // RWR: Not sure why this is required!
    // if (
    //   this.props.workflowKind.workflowKind !==
    //   prevProps.workflowKind.workflowKind
    // ) {
    //   if (this.props.workflowKind.workflowKind) {
    //     if (this.props.config.loading) {
    //     } else if (
    //       !this.props.config.loading &&
    //       this.props.config.configuration
    //     ) {
    //       this.getDefaultKind(true);
    //     }
    //   }
    // }
    /*//////////////////////////////////////////////////
      When filter is change workflow is reloaded/fetched and by
      default we set workflow kind filter that makes an extra call
      for workflow fetch so  by removing this call we reduced the
      extra call for workflow fetch thus reducing time to load
    */
    ////////////////////////////////////////////////////
  };

  // getDefaultKind = config_loaded => {
  //   const kindList = this.props.workflowKind.workflowKind;
  //   let defKind = null;

  //   defKind = kindList[0];

  //   if (defKind) {
  //     this.setState({ defKind: defKind });
  //     this.props.dispatch(
  //       workflowFiltersActions.setFilters({
  //         filterType: "kind",
  //         filterValue: [defKind.id],
  //         meta: defKind
  //       })
  //     );
  //     this.props.dispatch(workflowKindActions.getAlertCount(defKind.tag));
  //     if (_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
  //       this.props.dispatch(workflowKindActions.getCount(defKind.tag));
  //     }
  //   } else {
  //     this.reloadWorkflowList();
  //   }
  // };

  // reloadWorkflowList = () => {
  //   this.props.dispatch(workflowActions.getAll());
  // };

  // TODO: Use this for sending the user to the login screen in case he is logged out
  // redirectLoginPage = () => {
  //   this.props.dispatch(logout());
  // };

  // toggleWaitingFilter = () => {
  //   this.setState({ showWaitingFitler: !this.state.showWaitingFitler });
  // };

  // toggleListView = status => {
  //   this.setState({ statusView: status });
  // };

  checkAuth = () => {
    this.props.dispatch(checkAuth());
  };

  // RWR: Risk sorter. Primary and secondary field
  changeScoreOrder = order => {
    const isAscending = this.state.sortOrderAsc;
    const isSortingEnabled = this.state.sortingEnabled;
    if (!isSortingEnabled) {
      // Enable the sroting in descending mode
      this.setState({
        sortOrderAsc: false,
        sortingEnabled: true
      });
      return this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: ["-sorting_primary_field"]
        })
      );
    }

    if (isAscending) {
      // Disable the sorting
      this.setState({ sortingEnabled: false });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: []
        })
      );
    } else {
      // Enable sorting in the ascending mode
      this.setState({
        sortOrderAsc: true,
        sortingEnabled: true
      });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: ["sorting_primary_field"]
        })
      );
    }
  };

  // TODO: Get the loading and failed UI markup from here
  // RWR: Mesages for 1. loading, 2. loadin fails
  // showMessage = (isLoading, loadingText) => {
  //   let message = null;
  //   if (isLoading) {
  //     message = (
  //       <div className="text-center text-bold mr-top-lg">
  //         <Icon type="loading" style={{ fontSize: 24 }} />
  //         <span className="text-normal pd-left">
  //           {" "}
  //           <FormattedMessage id={loadingText} />
  //         </span>
  //       </div>
  //     );
  //   } else if (this.props.workflow.loadingStatus === "failed") {
  //     message = (
  //       <div className="mr-top-lg text-center text-bold text-metal">
  //         <FormattedMessage id="errorMessageInstances.noWorkflowsError" />.{" "}
  //         <div className="mr-top-lg text-center text-bold text-metal">
  //           <FormattedMessage id="errorMessageInstances.loggedOutError" />
  //           <div
  //             className="text-anchor text-anchor "
  //             onClick={this.redirectLoginPage}
  //           >
  //             <FormattedMessage id="commonTextInstances.clickToLogin" />
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  // return message;
  // };

  // TODO: Find a better way to handle this
  get notAllowedMessage() {
    const { config } = this.props;
    return (
      <div style={{ paddingTop: "150px" }}>
        <h4 className="text-center t-24 text-bold">
          {!config ? (
            "loading"
          ) : (
            <FormattedMessage id={"workflowsInstances.unauthorisedText"} />
          )}
        </h4>
      </div>
    );
  }

  get isLoading() {
    const { workflow, config, workflowKind } = this.props;
    return config.loading || workflow.loading || workflowKind.loading;
  }

  get getLoadingText() {
    const { workflow, config, workflowKind } = this.props;
    let text = null;
    if (config.loading) text = "workflowsInstances.loadingConfigsText";
    else if (workflowKind.loading)
      text = "workflowsInstances.loadingFiltersText";
    else if (workflow.loading) text = "workflowsInstances.fetchingDataText";
    return text;
  }

  // TODO: Handle the loading/failed state too in the UI
  // this.props.workflow.loadingStatus === "failed"
  render = () => {
    // const { workflow, config, workflowKind } = this.props;

    // TODO: Check if this is required
    // RWR: If
    // if (this.props.workflow.loadingStatus === "failed") {
    //   // TODO the checkAuth method only reports status text: `403 Forbidden`
    //   // In future, we should relook at a better way to handle this
    //   if (this.props.users.me && this.props.users.me.error === "Forbidden") {
    //     this.props.dispatch(logout());
    //     return;
    //   }
    // }

    // const renderPrep = {

    // };

    // const renderMessage = this.showMessage(
    //   renderPrep.isLoading,
    //   renderPrep.getLoadingText
    // );

    return (
      <Chowkidaar
        check={Permissions.CAN_VIEW_DASHBOARD}
        deniedElement={this.notAllowedMessage}
      >
        <div
          // className="workflow-container inner-container"
          style={{ minHeight: "100vh", paddingTop: 60 }}
          className={css`
            min-height: 100vh;
            /* Height of the header */
            padding-top: 60px;
            display: flex;
          `}
        >
          {/* TODO: Pass only required props */}
          {/* TODO: Incrementally uncomment it */}
          {/* <Sidebar {...this.props} /> */}
          <div
            className={css`
              flex-basis: 315px;
            `}
          >
            {/* <Sidebar /> */}
          </div>
          <div
            className={css`
              flex: 1;
            `}
          >
            {/* <Content style={{ margin: "4vh 4vw" }}> */}
            {/* <Row className="clear"> */}
            <WorkflowToolbar />

            {
              // <div className="clearfix">
              // TODO: Send only the required props
              // TODO: Incrementally uncomment it
              // <WorkflowList
              //   location={this.props.location}
              //   sortAscending={this.state.sortOrderAsc}
              //   profile={this.props.match}
              //   {...this.props}
              //   statusView={this.state.statusView}
              //   sortingEnabled={this.state.sortingEnabled}
              // />
              // </div>
            }
            {/* </Row> */}
            {/* </Content> */}
          </div>
        </div>
      </Chowkidaar>
    );
  };
}

// TODO: Remove the not required state bindings
function mapStateToProps(state) {
  const {
    config,
    workflow,
    authentication,
    workflowKind,
    workflowGroupCount,
    workflowAlertGroupCount,
    users,
    nextUrl,
    workflowFilters
  } = state;
  return {
    config,
    workflow,
    workflowKind,
    authentication,
    workflowAlertGroupCount,
    workflowGroupCount,
    users,
    nextUrl,
    workflowFilters
  };
}

export default connect(mapStateToProps)(injectIntl(Workflow));
