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
  workflowStepActions
} from "../../actions";
import Comments from "./comments";
import { FormattedMessage, injectIntl } from "react-intl";
import { goToPrevStep } from "../../utils/customBackButton";
import { get as lodashGet } from "lodash";
import { currentActiveStep } from "./utils/active-step";

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
      groupId && // these can be null when new Child WF is created
      stepId && // which has params ?new=true, until next refresh
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
  callBackCollapser = (objectId, content_type, isEmbeddedDetails) => {
    // TODO: Here it's called with no parameters when the comment section is
    // to be closed. Visibilty should be handled in state and not through an
    // API call. Also removing comments each time is not an efficient way.
    // They should rather be updated in-redux while the workflow is opened
    // and flished only when the workflow is closed.
    this.props.dispatch(
      workflowDetailsActions.getComment(objectId, content_type, "", false)
    );
  };

  addComment = (payload, step_reload_payload, isEmbeddedDetails) => {
    this.props.dispatch(
      workflowStepActions.addComment(payload, step_reload_payload)
    );
  };

  getIntegrationComments = (uid, field_id) => {
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
                selectedGroup={
                  workflowKeys[this.workflowId]
                    ? workflowKeys[this.workflowId].groupId
                    : null
                }
                selectedStep={
                  workflowKeys[this.workflowId]
                    ? workflowKeys[this.workflowId].stepId
                    : null
                }
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
