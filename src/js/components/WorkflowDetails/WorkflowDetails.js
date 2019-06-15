import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Tooltip, Divider } from "antd";
import SidebarView from "../../../modules/workflows/sidebar/components";
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
import { goToPrevStep } from "../../utils/customBackButton";

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
    console.log("props", this.props);
    this.props.dispatch(workflowActions.expandedWorkflowsList([]));
    this.getInitialData();

    if (this.props.location) {
      if (this.props.location.search) {
        this.setStepFromQuery();
      }
    }
  };

  componentDidUpdate = prevProps => {
    const { location, workflowDetails, currentStepFields, wfID } = this.props;
    console.log("location", location);

    let wd = workflowDetails;
    //SET WORKFLOW ID FROM ROUTER
    let workflowId = wfID || parseInt(this.props.match.params.id, 10);
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
      this.updateSidebar(wfID || workflowId);
    }

    //WHEN EVER SEARCH PARAMS CHANGE FETCH NEW STEP DATA

    //todo .search

    if (location.search !== prevProps.location.search) {
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
    const { wfID } = this.props;

    let workflowId = wfID || parseInt(this.props.match.params.id, 10);
    const { stepGroups } = this.props.workflowDetails.workflowDetails;
    //calculate activit step
    let act = currentActiveStep(stepGroups, workflowId);
    this.state.selectedGroup = act.groupId;
    this.state.selectedStep = act.stepId;

    if (!wfID) {
      history.replace(
        `/workflows/instances/${workflowId}?group=${act.groupId}&step=${
          act.stepId
        }`
      );
    } else {
      history.replace(
        `/workflows/instances/?group=${act.groupId}&step=${act.stepId}`
      );
    }
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
    const { wfID } = this.props;

    if (params.has("group") && params.has("step")) {
      let groupId = params.get("group");
      let stepId = params.get("step");

      this.state.selectedGroup = groupId;
      this.state.selectedStep = stepId;

      let stepTrack = {
        workflowId: wfID || parseInt(this.props.match.params.id, 10),
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
  callBackCollapser = (object_id, content_type, isEmbeddedDetails) => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.dispatch(
      workflowDetailsActions.getComment(object_id, content_type, "", false)
    );
  };

  addComment = (payload, step_reload_payload, isEmbeddedDetails) => {
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
    const { minimalUI } = this.props;

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

    let showBackButtom = true;

    if (
      localStorage.getItem("magicLogin") &&
      this.props.workflow.workflow_family &&
      this.props.workflow.workflow_family.length <= 1
    ) {
      showBackButtom = false;
    }

    const BackButton = () => {
      if (showBackButtom && !minimalUI) {
        return (
          <div
            style={{
              backgroundColor: "#104774",
              width: "75px",
              paddingTop: "28px"
            }}
          >
            <span
              onClick={goToPrevStep}
              className="text-anchor pd-ard-sm "
              style={{ padding: 15 }}
            >
              <i
                className="material-icons text-secondary"
                style={{
                  fontSize: "40px",
                  verticalAlign: "middle",
                  color: "#fff"
                }}
              >
                keyboard_backspace
              </i>
            </span>
          </div>
        );
      } else {
        return <span />;
      }
    };

    if (_.size(error)) {
      // LAYOUT PLACE HOLDER
      return (
        <PlaceHolder error={error} showFilterMenu={this.props.showFilterMenu} />
      );
    } else {
      return (
        <div>
          <Layout
            className="workflow-details-container inner-container"
            style={{ top: minimalUI ? 0 : 60 }}
          >
            <Layout
              style={{
                background: "#FAFAFA",
                minHeight: "100vh",
                paddingTop: minimalUI ? 30 : 0
              }}
            >
              <BackButton />

              <SidebarView minimalUI={minimalUI} />
              <Content style={{ width: "50%", marginTop: "12px" }}>
                <div className="printOnly ">
                  <div
                    className="mr-ard-lg"
                    id="StepBody"
                    style={{ background: "#FAFAFA" }}
                  >
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
                {!minimalUI && (
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
                )}
                {comment_data &&
                comment_data.results &&
                comment_data.results.length > 0 &&
                !comment_data.isEmbedded ? (
                  <div>
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
                  </div>
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
      <SidebarView />
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
