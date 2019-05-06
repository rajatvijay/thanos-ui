import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Tooltip, Divider } from "antd";
import StepSidebar from "./steps-sidebar";
import _ from "lodash";
import StepBody from "./step-body.js";
import { baseUrl, authHeader, history } from "../../_helpers";
import Moment from "react-moment";
import {
  workflowDetailsActions,
  workflowActions,
  workflowFiltersActions,
  workflowStepActions,
  configActions
} from "../../actions";
import { WorkflowHeader } from "../Workflow/workflow-item";
import Comments from "./comments";
import { FormattedMessage, injectIntl } from "react-intl";
import BreadCrums from "./BreadCrums";
import StepPreview from "../Workflow/StepPreview";
import { calculatedData } from "../Workflow/calculated-data";
import queryString from "query-string";
import { currentActiveStep } from "./utils/active-step";

const { getProgressData } = calculatedData;

const requestOptions = {
  method: "GET",
  headers: authHeader.get(),
  credentials: "include"
};

const { Sider, Content } = Layout;

class WorkflowDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workflowId: null,
      selectedStep: null,
      selectedGroup: null,
      printing: false,
      dont: false,
      firstLoad: true,
      currentStep: null
    };
  }

  componentDidMount = () => {
    this.props.dispatch(workflowActions.expandedWorkflowsList([]));
    this.getInitialData();

    if (this.props.location.search) {
      this.setStepFromQuery();
    }
  };

  componentDidUpdate = prevProps => {
    const { location, workflowDetails, currentStepFields } = this.props;
    let wd = workflowDetails;
    //SET WORKFLOW ID FROM ROUTER
    let workflowId = parseInt(this.props.match.params.id, 10);
    let thisCurrent = currentStepFields;
    let prevCurrent = prevProps.currentStepFields;

    //CHECK IF THE STEP COMPLETION HAS CHANGED//
    //CALCULATE STEP ON SUBMISSION OR UNDO//
    if (
      _.size(prevCurrent.currentStepFields) && //check step data for non empty
      _.size(thisCurrent.currentStepFields) && //check step data for non empty
      prevCurrent.currentStepFields.id === thisCurrent.currentStepFields.id && //CHECK IF PREV AND CURRENT STEP ARE SAME
      prevCurrent.currentStepFields.completed_by !==
        thisCurrent.currentStepFields.completed_by //CHECK IS COMPLETION HAS CHANGED
    ) {
      if (thisCurrent.currentStepFields.completed_by) {
        //IF STEP HAS BEEN COMPLETED
        history.replace(`/workflows/instances/${workflowId}`); //UPDATE URL TO ROOT WHICH WILL AUTOMATICALLY CALCULATE ACTIVE STEP
      } else {
        //IF STEP HAS BEEN REVERTED
        this.updateSidebar(workflowId); //UPDATED SIDEBAR TO REFLECT THE REVERSION, NO NEED TO UPDATE URL SINCE CURRENT STEP DATA IS AUTOMATICALLY LOADED
      }
    }

    //WHEN EVER SEARCH PARAMS CHANGE FETCH NEW STEP DATA
    if (this.props.location.search !== prevProps.location.search) {
      this.setStepFromQuery();
    }

    //IF REQUIRED DATA IS LOADED AND CURRENT STEP DATA IS NOT AVAILABLE
    //CALCULATE CURRENT STEP DATA AND FETCH THE FEILDS.
    if (
      !this.props.location.search &&
      !this.props.workflowDetails.loading &&
      wd.workflowDetails.stepGroups &&
      wd.workflowDetails.stepGroups.results[0].workflow === workflowId
    ) {
      this.updateCurrentActiveStep();
    }

    console.log("this.props--------");
    console.log(this.props);
  };

  updateSidebar = id => {
    this.props.dispatch(workflowDetailsActions.getStepGroup(id));
  };

  updateCurrentActiveStep = () => {
    let workflowId = parseInt(this.props.match.params.id, 10);
    const { stepGroups } = this.props.workflowDetails.workflowDetails;
    //calculate activit step
    let act = currentActiveStep(stepGroups, workflowId);
    this.state.selectedGroup = act.groupId;
    this.state.selectedStep = act.stepId;
    history.replace(
      `/workflows/instances/${workflowId}?group=${act.groupId}&step=${
        act.stepId
      }`
    );
  };

  reinitialize = () => {
    this.getInitialData();
  };

  getInitialData = () => {
    //Get workflow  basic data
    this.props.dispatch(workflowFiltersActions.getStatusData());

    if (
      !this.props.config.configuration ||
      this.props.config.error ||
      !_.size(this.props.config.permission)
    ) {
      this.props.dispatch(configActions.getConfig());
    }

    window.scrollTo(0, 0);
  };

  setStepFromQuery = () => {
    // querystring to object queryparams
    //calculate step track
    //dispatch workflow step details
    let params = this.props.location.search;
    let qs = queryString.parse(this.props.location.search);

    if (qs.group && qs.step) {
      this.state.selectedStep = qs.step;
      this.state.selectedGroup = qs.group;
      this.state.from_params = true;
    }

    if (qs.object_id && qs.type) {
      this.props.dispatch(
        workflowDetailsActions.getComment(qs.object_id, qs.type)
      );
    }

    if (qs.group && qs.step) {
      let stepTrack = {
        workflowId: parseInt(this.props.match.params.id, 10),
        groupId: qs.group,
        stepId: qs.step
      };

      this.fetchStepData(stepTrack);
    }
  };

  selectActiveStep = (step_id, stepGroup_id) => {
    this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
  };

  fetchStepData = payload => {
    this.props.dispatch(workflowDetailsActions.getStepFields(payload));
  };

  isParentWorkflow = () => {
    return (
      this.props.workflowDetailsHeader.workflowDetailsHeader.workflow_family
        .length === 1
    );
  };

  ////Comment functions begins///////
  /// this will be moved to another component///
  callBackCollapser = (object_id, content_type) => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.dispatch(
      workflowDetailsActions.getComment(object_id, content_type)
    );
  };

  addComment = (payload, step_reload_payload) => {
    this.state.adding_comment = true;
    this.state.object_id = payload.object_id;
    this.props.dispatch(
      workflowStepActions.addComment(payload, step_reload_payload)
    );
  };

  getIntegrationComments = (uid, field_id) => {
    this.state.loading_sidebar = true;
    let payload = {
      uid: uid,
      field_id: field_id
    };
    this.props.dispatch(
      workflowDetailsActions.getComment(1, "integrationresult", payload)
    );
  };

  changeFlag = payload => {
    this.props.dispatch(workflowStepActions.updateFlag(payload));
  };

  changeIntegrationStatus = payload => {
    this.props.dispatch(workflowStepActions.updateIntegrationStatus(payload));
  };

  ////Comment functions ends///////

  render = () => {
    let stepLoading = this.props.workflowDetails.loading;
    let HeaderLoading = this.props.workflowDetailsHeader.loading;
    let formLoading = this.props.currentStepFields.loading;
    let comment_data = this.props.workflowComments.data;

    let error = this.props.workflowDetailsHeader.error || this.state.error;
    if (error === "Not Found") {
      error = "errorMessageInstances.workflowNotFound";
    }
    // error can be an ID from intlMessages or text to be displayed.
    // If ID is not found, it is rendered as text by default.

    if (_.size(error)) {
      return (
        <Layout className="workflow-details-container inner-container">
          <StepSidebar showFilterMenu={this.props.showFilterMenu} />
          <Layout
            style={{
              background: "#FBFBFF",
              minHeight: "100vh",
              paddingTop: "30px"
            }}
          >
            <Content>
              <div className="printOnly ">
                <div className="mr-ard-lg  shadow-1 bg-white" id="StepBody">
                  <div className="text-center text-metal mr-ard-lg">
                    <br />
                    <br />
                    <FormattedMessage id={error} />
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      );
    } else {
      return (
        <div>
          <div
            className="workflow-details-top-card vertical-padder-16 side-padder-16 bg-white"
            style={{
              position: "relative",
              zIndex: 1,
              top: 63,
              boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.06)"
            }}
          >
            {HeaderLoading ||
            !this.props.workflowDetailsHeader.workflowDetailsHeader ? (
              <div className="text-center">
                <Icon type="loading" />
              </div>
            ) : (
              <div>
                {!this.isParentWorkflow() ? (
                  <BreadCrums
                    items={
                      this.props.workflowDetailsHeader.workflowDetailsHeader
                        .workflow_family
                    }
                  />
                ) : null}
                <WorkflowHeader
                  detailsPage={true}
                  kind={this.props.workflowKind}
                  workflow={
                    this.props.workflowDetailsHeader.workflowDetailsHeader
                  }
                  statusType={this.props.workflowFilterType.statusType}
                  showCommentIcon={true}
                  getCommentSidebar={this.callBackCollapser}
                  nextUrl={this.props.nextUrl}
                />
              </div>
            )}
          </div>

          <Layout className="workflow-details-container inner-container">
            <StepSidebar
              step2={
                this.props.workflowDetails.workflowDetails
                  ? this.props.workflowDetails.workflowDetails.stepGroups
                      .results
                  : null
              }
              defaultSelectedKeys={
                this.state.selectedStep
                  ? this.state.selectedStep.toString()
                  : null
              }
              defaultOpenKeys={
                this.state.selectedGroup
                  ? this.state.selectedGroup.toString()
                  : null
              }
              //onStepSelected={this.onStepSelected.bind(this)}
              loading={stepLoading}
              alerts={
                this.props.workflowDetailsHeader.workflowDetailsHeader
                  ? this.props.workflowDetailsHeader.workflowDetailsHeader
                      .alerts
                  : null
              }
              workflow={this.props.workflowId}
              showFilterMenu={this.props.showFilterMenu}
            />
            <Layout
              style={{
                background: "#FBFBFF",
                minHeight: "100vh",
                paddingTop: "30px"
              }}
            >
              <Content>
                <div className="printOnly ">
                  <div className="mr-ard-lg  shadow-1 bg-white" id="StepBody">
                    <StepBody
                      toggleSidebar={this.callBackCollapser}
                      changeFlag={this.changeFlag}
                      getIntegrationComments={this.getIntegrationComments}
                      workflowHead={
                        this.props.workflowDetailsHeader.workflowDetailsHeader
                          ? this.props.workflowDetailsHeader
                              .workflowDetailsHeader
                          : "loading"
                      }
                    />
                  </div>
                </div>
                <div className="text-right pd-ard mr-ard-md">
                  <Tooltip
                    title={this.props.intl.formatMessage({
                      id: "commonTextInstances.scrollToTop"
                    })}
                    placement="topRight"
                  >
                    <span
                      className="text-anchor"
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      <i className="material-icons">arrow_upward</i>
                    </span>
                  </Tooltip>
                </div>
                {comment_data && _.size(comment_data.results) ? (
                  <Comments
                    object_id={this.state.object_id}
                    toggleSidebar={this.callBackCollapser}
                    addComment={this.addComment}
                    gotoStep={this.fetchStepData}
                    selectActiveStep={this.selectActiveStep}
                    changeFlag={this.changeFlag}
                    changeIntegrationStatus={this.changeIntegrationStatus}
                    {...this.props}
                  />
                ) : null}
              </Content>
            </Layout>
          </Layout>
        </div>
      );
    }
  };
}

function mapStateToProps(state) {
  const {
    currentStepFields,
    workflowDetails,
    workflowDetailsHeader,
    workflowFilterType,
    workflowKind,
    workflowComments,
    authentication,
    hasStepinfo,
    users,
    config,
    showFilterMenu,
    showPreviewSidebar,
    nextUrl
  } = state;

  return {
    currentStepFields,
    workflowDetails,
    workflowDetailsHeader,
    workflowFilterType,
    workflowKind,
    workflowComments,
    authentication,
    hasStepinfo,
    users,
    config,
    showFilterMenu,
    showPreviewSidebar,
    nextUrl
  };
}

export default connect(mapStateToProps)(injectIntl(WorkflowDetails));
