import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Tooltip } from "antd";
import SidebarView from "../../../modules/workflows/sidebar/components";
import _ from "lodash";
import StepBody from "./step-body.js";
import { history } from "../../_helpers";
import {
  setWorkflowKeys,
  stepBodyActions,
  workflowDetailsActions,
  workflowFiltersActions,
  workflowStepActions
} from "../../actions";
import Comments from "./comments";
import { FormattedMessage, injectIntl } from "react-intl";
import { goToPrevStep } from "../../utils/customBackButton";
import { get as lodashGet } from "lodash";
import { currentActiveStep } from "./utils/active-step";
import NextStepPlaceholder from "./NextStepPlaceholder";

const { Content } = Layout;

class WorkflowDetails extends Component {
  constructor(props) {
    const { minimalUI, setWorkflowKeys, workflowIdFromPropsForModal } = props;
    const params = new URL(document.location).searchParams;

    const workflowId =
      workflowIdFromPropsForModal || parseInt(props.match.params.id, 10);

    const groupId = params.get("group");
    const stepId = params.get("step");

    setWorkflowKeys({ workflowId, stepId, groupId });

    super(props);
    this.state = {
      newWorkflow: params.get("new") === "true",
      currentStep: null,
      // TODO: Check why we need groupId check
      displayProfile: minimalUI ? true : !groupId
    };
  }

  componentDidMount = () => {
    // TODO: Why??
    this.getInitialData();
  };

  componentDidUpdate = prevProps => {
    const {
      workflowIdFromPropsForModal,
      match,
      minimalUI,
      workflowKeys
    } = this.props;

    const { displayProfile, newWorkflow } = this.state;
    const params = new URL(document.location).searchParams;
    const groupId = params.get("group");
    const stepId = params.get("step");
    //SET WORKFLOW ID FROM ROUTER
    const workflowId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);

    if (
      !minimalUI &&
      match &&
      workflowKeys[workflowId] &&
      workflowKeys[workflowId].stepId !== stepId &&
      workflowKeys[workflowId].groupId !== groupId
    ) {
      this.handleUpdateOfActiveStep(groupId, stepId);
    }
    if (
      _.get(prevProps, `workflowDetails["${workflowId}"].loading`, null) ===
        true &&
      _.get(this.props, `workflowDetails["${workflowId}"].loading`, null) !==
        true &&
      (newWorkflow || params.get("new") === "true")
    ) {
      // when workflow is loaded and it's a created workflow
      // navigate to the first step of the first step group

      const groups = _.get(
        this.props,
        `workflowDetails["${workflowId}"].workflowDetails.stepGroups`,
        null
      );
      if (groups !== null) {
        // has groups
        const { groupId, stepId } = currentActiveStep(groups, workflowId);
        if (groupId && stepId) this.handleUpdateOfActiveStep(groupId, stepId);
      }
      this.setState({
        newWorkflow: false
      });
    }

    if (!minimalUI && match && !stepId && !groupId && !displayProfile) {
      this.setState({ displayProfile: true });
    }
    if (stepId && groupId && displayProfile && !minimalUI) {
      this.setState({ displayProfile: false });
    }

    if (this.isTheStepAutoSubmitted(prevProps, this.props, stepId)) {
      this.props.dispatch(workflowDetailsActions.getById(workflowId));
      this.props.getStepGroup(workflowId, true);
    }
  };

  isTheStepAutoSubmitted = (previousProps, currentProps, stepId) => {
    const previousCompletedBy = lodashGet(
      previousProps,
      `currentStepFields.${stepId}.currentStepFields.completed_by`
    );
    const currentCompletedBy = lodashGet(
      currentProps,
      `currentStepFields.${stepId}.currentStepFields.completed_by`
    );
    if (previousCompletedBy === null && !!currentCompletedBy) {
      return true;
    }
    return false;
  };

  updateCurrentActiveStep = () => {
    const {
      workflowIdFromPropsForModal,
      minimalUI,
      displayProfile
    } = this.props;

    const workflowId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);
    //   workflowId
    //calculate activit step
    const stepTrack = {
      workflowId,
      groupId: this.state.selectedGroup,
      stepId: this.state.selectedStep
    };

    if (
      !displayProfile &&
      !minimalUI &&
      !this.props.currentStepFields[stepTrack.stepId]
    ) {
      this.fetchStepData(stepTrack);
    }
  };

  getInitialData = () => {
    //Get workflow  basic data
    this.props.dispatch(workflowFiltersActions.getStatusData());
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
    const payload = {
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

  getStepDetailsData = (workflowId, groupId, stepId) => {
    const stepTrack = {
      workflowId,
      groupId,
      stepId
    };

    this.fetchStepData(stepTrack);
  };

  handleUpdateOfActiveStep = (groupId, stepId) => {
    const workflowId =
      this.props.workflowIdFromPropsForModal ||
      parseInt(this.props.match.params.id, 10);
    const { setWorkflowKeys } = this.props;

    if (!this.props.minimalUI && groupId && stepId) {
      history.replace(
        `/workflows/instances/${workflowId}?group=${groupId}&step=${stepId}`
      );
    }
    setWorkflowKeys({ workflowId, stepId, groupId });

    this.setState({ displayProfile: false });
    this.getStepDetailsData(
      this.props.workflowIdFromPropsForModal ||
        Number(this.props.match.params.id),
      groupId,
      stepId
    );

    if (this.props.minimalUI) this.props.setParameter(stepId, groupId);
  };

  changeProfileDisplay = displayProfile => {
    const { setWorkflowKeys, workflowIdFromPropsForModal } = this.props;

    const workflowId =
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10);

    if (!this.props.minimalUI) {
      history.replace(`/workflows/instances/${workflowId}`);
    }

    setWorkflowKeys({ workflowId, step: null, groupId: null });

    this.setState({ displayProfile });
  };

  ////Comment functions ends///////

  // ////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////

  get workflowId() {
    const { workflowIdFromPropsForModal } = this.props;
    return (
      workflowIdFromPropsForModal || parseInt(this.props.match.params.id, 10)
    );
  }

  showComments = () => {
    const commentsData = lodashGet(this.props, "workflowComments.data", null);
    return commentsData && commentsData.results && !commentsData.isEmbedded;
  };

  showBackButton = () => {
    return (
      this.props.workflow &&
      this.props.workflow.workflow_family &&
      this.props.workflow.workflow_family.length <= 1 &&
      !this.props.minimalUI
    );
  };

  renderBackButton = () => {
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
  };

  getLoadingError() {
    const { workflowDetailsHeader } = this.props;
    const error = [];
    error[0] = !!workflowDetailsHeader.error;
    error[1] =
      workflowDetailsHeader.error === "Not Found"
        ? "errorMessageInstances.workflowNotFound"
        : workflowDetailsHeader.error;
    return error;
  }

  getNextStep = () => {
    const { stepId: currentStepId, groupId: currentGroupId } = lodashGet(
      this.props,
      `workflowKeys[${this.workflowId}]`,
      {}
    );
    const allStepGroups = lodashGet(
      this.props,
      `workflowDetails[${this.workflowId}].workflowDetails.stepGroups.results`,
      []
    );

    // TODO: Can be optimized using memoization
    const allVisibleStepGroups = allStepGroups.filter(
      stepGroup => !!stepGroup.steps.length
    );

    // Steps hasn't been loaded yet
    if (!allVisibleStepGroups.length) {
      return [null, null];
    }

    // User is on the profile step
    if (!currentStepId && !currentGroupId) {
      return [allVisibleStepGroups[0].id, allVisibleStepGroups[0].steps[0].id];
    }

    // Find the index of currentStepGroup and currentStep
    let currentStepGroupIndex, currentStepIndex;
    allVisibleStepGroups.forEach((group, groupIndex) => {
      if (group.id === Number(currentGroupId)) {
        currentStepGroupIndex = groupIndex;
        group.steps.forEach((step, stepIndex) => {
          if (step.id === Number(currentStepId)) {
            currentStepIndex = stepIndex;
          }
        });
      }
    });

    const nextStep =
      allVisibleStepGroups[currentStepGroupIndex].steps[currentStepIndex + 1];

    // If we have the next step in the same group
    if (nextStep) {
      return [currentGroupId, nextStep.id];
    }

    const nextStepGroup = allVisibleStepGroups[currentStepGroupIndex + 1];

    // Take the user to the first step of the next stepgroup
    if (nextStepGroup) {
      return [nextStepGroup.id, nextStepGroup.steps[0].id];
    }

    // User is already on the last step group and last step
    return [null, null];
  };

  handleOnInView = () => {
    const [nextStepGroup, nextStep] = this.getNextStep();
    if (!nextStepGroup && !nextStep) {
      return;
    }
    this.handleUpdateOfActiveStep(nextStepGroup, nextStep);
  };

  get selectedGroup() {
    return lodashGet(
      this.props,
      `workflowKeys[${this.workflowId}].groupId`,
      null
    );
  }

  get selectedStep() {
    return lodashGet(
      this.props,
      `workflowKeys[${this.workflowId}].stepId`,
      null
    );
  }

  get isLoadingStepData() {
    return (
      lodashGet(
        this.props,
        `currentStepFields[${this.selectedStep}].loading`,
        false
      ) ||
      lodashGet(
        this.props,
        `workflowDetails[${this.workflowId}].workflowDetails.loading`,
        false
      )
    );
  }

  render = () => {
    const {
      minimalUI,
      workflowIdFromPropsForModal,
      workflowItem,
      workflowKeys
    } = this.props;
    const { displayProfile } = this.state;
    const [hasError, errorMessage] = this.getLoadingError();

    if (hasError) {
      // LAYOUT PLACE HOLDER
      return (
        <PlaceHolder
          error={errorMessage}
          showFilterMenu={this.props.showFilterMenu}
        />
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
              {this.showBackButton() && this.renderBackButton()}

              <SidebarView
                selectedGroup={this.selectedGroup}
                selectedStep={this.selectedStep}
                minimalUI={minimalUI}
                workflowIdFromDetailsToSidebar={this.workflowId}
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
                    {!this.props.hideStepBody && (
                      <StepBody
                        stepId={
                          workflowKeys[this.workflowId]
                            ? workflowKeys[this.workflowId].stepId
                            : null
                        }
                        workflowId={this.workflowId}
                        workflowIdFromPropsForModal={
                          workflowIdFromPropsForModal
                        }
                        toggleSidebar={this.callBackCollapser}
                        changeFlag={this.changeFlag}
                        getIntegrationComments={this.getIntegrationComments}
                        workflowHead={
                          minimalUI
                            ? workflowItem
                            : this.props.workflowDetailsHeader[this.workflowId]
                            ? this.props.workflowDetailsHeader[this.workflowId]
                            : null
                        }
                        dispatch={this.props.dispatch}
                        displayProfile={this.state.displayProfile}
                      />
                    )}
                  </div>
                  <NextStepPlaceholder onInView={this.handleOnInView} />
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
                {this.showComments() && (
                  <div>
                    <Comments
                      object_id={this.state.object_id}
                      toggleSidebar={this.callBackCollapser}
                      addComment={this.addComment}
                      gotoStep={this.fetchStepData}
                      selectActiveStep={this.handleUpdateOfActiveStep}
                      changeFlag={this.changeFlag}
                      changeIntegrationStatus={this.changeIntegrationStatus}
                      {...this.props}
                    />
                  </div>
                )}
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
    nextUrl,
    workflowKeys
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
    nextUrl,
    workflowKeys
  };
}

export default connect(
  mapStateToProps,
  {
    stepBodyActions,
    setWorkflowKeys,
    getStepGroup: workflowDetailsActions.getStepGroup
  }
)(injectIntl(WorkflowDetails));
