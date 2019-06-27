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
    const params = new URL(document.location).searchParams;
    //console.log("params",params)
    const groupId = params.get("group");
    const stepId = params.get("step");

    super(props);
    this.state = {
      // workflowId: null,
      selectedStep: stepId || null,
      selectedGroup: groupId || null,
      printing: false,
      dont: false,
      firstLoad: true,
      currentStep: null,
      displayProfile: groupId ? false : true
    };
  }

  componentDidMount = () => {
    // TODO: Why??
    this.props.dispatch(workflowActions.expandedWorkflowsList([]));
    this.getInitialData();
    // this.setStepFromQuery()
  };

  componentDidUpdate = prevProps => {
    const {
      location,
      workflowDetails,
      currentStepFields,
      workflowIdFromPropsForModal
    } = this.props;

    // let wd = workflowDetails;
    //SET WORKFLOW ID FROM ROUTER
    let workflowId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);
    let thisCurrent = currentStepFields;
    let prevCurrent = prevProps.currentStepFields;

    const newWorflowId =
      this.props.workflowIdFromPropsForModal ||
      Number(this.props.match.params.id);
    const oldWorkflowId =
      prevProps.workflowIdFromPropsForModal ||
      Number(prevProps.match.params.id);

    if (newWorflowId !== oldWorkflowId) {
      console.log("run");
      this.updateCurrentActiveStep();
    }

    try {
      if (
        prevProps.workflowDetails[oldWorkflowId].loading &&
        !this.props.workflowDetails[newWorflowId].loading
      ) {
        this.updateCurrentActiveStep();
      }
    } catch (e) {
      console.log(
        "Making first API call for step fields",
        "Error",
        e,
        prevProps.workflowDetails[oldWorkflowId],
        this.props.workflowDetails[newWorflowId]
      );
    }

    // const params = new URLSearchParams(this.props.location.search);

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
      this.updateSidebar(workflowIdFromPropsForModal || workflowId);
    }

    if (prevCurrent.currentStepFields.id !== thisCurrent.currentStepFields.id) {
      console.log("should scorll ✅✅✅✅✅✅✅");

      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }

    //WHEN EVER SEARCH PARAMS CHANGE FETCH NEW STEP DATA

    //todo .search

    // if (location.search !== prevProps.location.search) {
    //   this.setStepFromQuery();
    // }
    // if(this.props.workflowIdFromPropsForModal && this.props.workflowDetails[workflowId] !== prevProps.workflowDetails[workflowId])
    //     {
    //       this.setStepFromQuery()
    //     }

    //IF REQUIRED DATA IS LOADED AND CURRENT STEP DATA IS NOT AVAILABLE
    //CALCULATE CURRENT STEP DATA AND FETCH THE FEILDS.

    //before
    // if (
    //   !this.props.location.search &&
    //   !this.props.workflowDetails.loading &&
    //   wd.workflowDetails.stepGroups &&
    //   wd.workflowDetails.stepGroups.results[0].workflow === workflowId
    // ) {
    //   this.updateCurrentActiveStep();
    // }

    // //WHEN SIDEBAR IS UPDATED AND DATA HAS CHANGED
    // //UPDATE CURRENT ACTIVE STEP
    // if (
    //   wd.workflowDetails &&
    //   prevProps.workflowDetails.workflowDetails &&
    //   wd.workflowDetails.stepGroups !==
    //     prevProps.workflowDetails.workflowDetails.stepGroups &&
    //   !params.has("backing")
    // ) {
    //   this.updateCurrentActiveStep();
    // }
    // console.log("work", this.props, prevProps, workflowId);
    // if (
    //   this.props.workflowDetails[workflowId] &&
    //   this.props.workflowDetails[workflowId].workflowDetails
    // ) {
    //   if (
    //     !this.props.location.search &&
    //     !this.props.workflowDetails[workflowId].workflowDetails.loading &&
    //     this.props.workflowDetails[workflowId].workflowDetails.stepGroups &&
    //     this.props.workflowDetails[workflowId].workflowDetails.stepGroups
    //       .results[0].workflow === workflowId
    //   ) {
    //     console.log("21st");
    //     // TODO: Why?? [Rajat]
    //     // this.updateCurrentActiveStep();
    //   }

    //   //WHEN SIDEBAR IS UPDATED AND DATA HAS CHANGED
    //   //UPDATE CURRENT ACTIVE STEP
    //   if (
    //     //this.props.workflowDetails &&
    //     prevProps.workflowDetails[workflowId].workflowDetails &&
    //     this.props.workflowDetails[workflowId].workflowDetails.stepGroups !==
    //       prevProps.workflowDetails[workflowId].workflowDetails.stepGroups
    //     //    &&
    //     // !params.has("backing")
    //   ) {
    //     console.log("2nd");
    //     this.updateCurrentActiveStep();
    //     // this.setStepFromQuery();
    //   }
    // }
    // if () {

    // }
  };

  updateSidebar = id => {
    this.props.dispatch(workflowDetailsActions.getStepGroup(id));
  };

  updateCurrentActiveStep = () => {
    // console.log("update");
    const { workflowIdFromPropsForModal } = this.props;

    let workflowId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);
    const { stepGroups } = this.props.workflowDetails[
      workflowId
    ].workflowDetails;
    //calculate activit step
    //let act = currentActiveStep(stepGroups, workflowId);
    // this.setState(
    //   {
    //     selectedGroup: act.groupId,
    //     selectedStep: act.stepId
    //   },
    //   () => {

    //   }
    // );
    const stepTrack = {
      workflowId,
      groupId: this.state.selectedGroup,
      stepId: this.state.selectedStep
    };
    console.log("trck", stepTrack);

    this.fetchStepData(stepTrack);
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
    //console.log("id",this.props)

    //const {workflowId} = this.props

    this.props.dispatch(workflowFiltersActions.getStatusData());

    if (
      !this.props.config.configuration ||
      this.props.config.error ||
      !_.size(this.props.config.permission)
    ) {
      this.props.dispatch(configActions.getConfig());
    }

    //window.scrollTo(0, 0);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  selectActiveStep = (step_id, stepGroup_id) => {
    this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
  };

  fetchStepData = payload => {
    const payloadWithMeta = {
      ...payload,
      fromEmbedded: this.props.fromEmbedded
    };
    this.props.dispatch(workflowDetailsActions.getStepFields(payloadWithMeta));
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

  getStepDetailsData = workflowId => {
    const stepTrack = {
      workflowId,
      groupId: this.state.selectedGroup,
      stepId: this.state.selectedStep
    };

    this.fetchStepData(stepTrack);
  };

  handleUpdateOfActiveStep = (groupId, stepId) => {
    const workflowId =
      this.props.workflowIdFromPropsForModal ||
      parseInt(this.props.match.params.id, 10);

    if (!this.props.minimalUI) {
      history.replace(
        `/workflows/instances/${workflowId}?group=${groupId}&step=${stepId}`
      );
    }
    this.setState(
      {
        selectedGroup: groupId,
        selectedStep: stepId,
        displayProfile: false
      },
      () => {
        this.getStepDetailsData(
          this.props.workflowIdFromPropsForModal ||
            Number(this.props.match.params.id)
        );
      }
    );
    console.log("check", groupId, this.state);
    if (this.props.minimalUI) this.props.setParameter(stepId, groupId);
  };

  changeProfileDisplay = displayProfile => {
    this.setState({ displayProfile });
  };

  ////Comment functions ends///////

  render = () => {
    const { minimalUI, workflowIdFromPropsForModal, workflowItem } = this.props;
    const { displayProfile } = this.state;
    console.log("wo", this.props.workflow);
    const params = new URL(document.location).searchParams;

    const workflowId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);
    //   //const { stepGroups } = workflowDetails.workflowDetails;
    //   //calculate activit step
    //  // const act = currentActiveStep(stepGroups, workflowId);
    //   const act = workflowDetails.workflowDetails ? currentActiveStep(workflowDetails.workflowDetails, workflowId) : {}

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
                chevron_left
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
      console.log("e");
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
                padding: minimalUI ? "30px 0px" : 0,
                marginTop: minimalUI ? 80 : 0
              }}
            >
              <BackButton />

              <SidebarView
                selectedGroup={this.state.selectedGroup}
                selectedStep={this.state.selectedStep}
                minimalUI={minimalUI}
                workflowIdFromDetailsToSidebar={workflowId}
                onUpdateOfActiveStep={this.handleUpdateOfActiveStep}
                displayProfile={displayProfile}
                changeProfileDisplay={this.changeProfileDisplay}
              />
              <Content
                style={{
                  width: "50%",
                  marginTop: minimalUI ? 0 : 12,
                  paddingLeft: "10px"
                }}
              >
                <div className="printOnly ">
                  <div
                    className="mr-ard-lg"
                    id="StepBody"
                    style={{
                      background: "#FAFAFA",
                      margin: minimalUI ? "0px 24px 0px 0px" : "24px"
                    }}
                  >
                    <StepBody
                      stepId={this.state.selectedStep}
                      workflowIdFromPropsForModal={workflowIdFromPropsForModal}
                      toggleSidebar={this.callBackCollapser}
                      changeFlag={this.changeFlag}
                      getIntegrationComments={this.getIntegrationComments}
                      workflowHead={
                        minimalUI
                          ? workflowItem
                          : this.props.workflowDetailsHeader[workflowId]
                          ? this.props.workflowDetailsHeader[workflowId]
                          : {}
                      }
                      displayProfile={this.state.displayProfile}
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
                          window.scroll({
                            top: 0,
                            left: 0,
                            behavior: "smooth"
                          });
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
