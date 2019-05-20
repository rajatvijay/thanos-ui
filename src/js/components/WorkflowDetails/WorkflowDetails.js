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
import { WorkflowHeader } from "../Workflow/WorkflowHeader";
import Comments from "./comments";
import { FormattedMessage, injectIntl } from "react-intl";
import BreadCrums from "./BreadCrums";
import StepPreview from "../Workflow/StepPreview";
import { calculatedData } from "../Workflow/calculated-data";
import { currentActiveStep } from "./utils/active-step";

const { getProgressData } = calculatedData;

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

    const params = new URLSearchParams(this.props.location.search);

    //CHECK IF THE STEP COMPLETION HAS CHANGED//
    //CALCULATE STEP ON SUBMISSION OR UNDO//
    if (
      _.size(prevCurrent.currentStepFields) && //check step data for non empty ✅
      _.size(thisCurrent.currentStepFields) && //check step data for non empty ✅
      //CHECK IF PREV AND CURRENT STEP ARE SAME
      prevCurrent.currentStepFields.id === thisCurrent.currentStepFields.id &&
      // //CHECK IS COMPLETION HAS CHANGED
      prevCurrent.currentStepFields.completed_by !==
        thisCurrent.currentStepFields.completed_by
    ) {
      this.updateSidebar(workflowId);
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

    //WHEN SIDEBAR IS UPDATED AND DATA HAS CHANGED
    //UPDATE CURRENT ACTIVE STEP
    if (
      wd.workflowDetails &&
      prevProps.workflowDetails.workflowDetails &&
      wd.workflowDetails.stepGroups !==
        prevProps.workflowDetails.workflowDetails.stepGroups &&
      !params.has("backing")
    ) {
      this.updateCurrentActiveStep();
    }
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

  checkWorkflowCompetion = () => {
    let step_groups = {
      step_groups: this.props.workflowDetails.workflowDetails.stepGroups.results
    };
    let prog = getProgressData(step_groups);
    return prog;
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
    const params = new URLSearchParams(this.props.location.search);

    if (params.has("group") && params.has("step")) {
      let groupId = params.get("group");
      let stepId = params.get("step");

      this.state.selectedGroup = groupId;
      this.state.selectedStep = stepId;

      let stepTrack = {
        workflowId: parseInt(this.props.match.params.id, 10),
        groupId: groupId,
        stepId: stepId
      };

      this.fetchStepData(stepTrack);
    }

    if (params.has("object_id") && params.has("type")) {
      this.props.dispatch(
        workflowDetailsActions.getComment(
          params.get("object_id"),
          params.get("type")
        )
      );
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
      // LAYOUT PLACE HOLDER
      return (
        <PlaceHolder error={error} showFilterMenu={this.props.showFilterMenu} />
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

const PlaceHolder = props => {
  return (
    <Layout className="workflow-details-container inner-container">
      <StepSidebar showFilterMenu={props.showFilterMenu} />
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
                <FormattedMessage id={props.error} />
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
};

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
