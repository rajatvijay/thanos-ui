import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Tooltip } from "antd";
import SidebarView from "../../../modules/workflows/sidebar/components";
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
import { getStepAndFromConfig } from "./utils/active-step";
import NextStepPlaceholder from "./NextStepPlaceholder";
import { css } from "emotion";
import {
  WORKFLOW_DETAILS_CONTAINER_PADDING_RIGHT,
  WORKFLOW_DETAILS_CONTAINER_PADDING_LEFT,
  BACK_BUTTON_WIDTH,
  BACK_BUTTON_MARGIN_RIGHT,
  MODAL_WIDTH,
  WORKFLOW_DETAILS_SIDEBAR_WIDTH,
  WORKFLOW_DETAILS_SIDEBAR_PADDING
} from "./utils/constants";

/**
 * TODOs:
 * [] Scroll up syncing of step with sidebar
 * [] Quick view testing
 * [] All other todos
 * [] Smooth user experience while scrolling down
 */

const namespacedLogger = (namespace, turnOff = false) => (...args) =>
  !turnOff && console.debug(namespace, ...args);

const wdLog = namespacedLogger("WorkflowDetails");

const { Content } = Layout;

class WorkflowDetails extends Component {
  // Getters
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  get stepGroups() {
    return lodashGet(
      this.props,
      `workflowDetails["${this.workflowId}"].workflowDetails.stepGroups.results`,
      []
    ).filter(group => !!group.steps.length);
  }

  get lcData() {
    const { minimalUI, workflowItem, workflowDetailsHeader } = this.props;

    const workflow = minimalUI
      ? workflowItem
      : lodashGet(workflowDetailsHeader, this.workflowId, null);

    // If we get a null in workflow, we should return [].
    if (!workflow) return [];

    // Check if we don't have any lc_data at all, then we return [] as well.
    if (!Array.isArray(workflow.lc_data) || workflow.lc_data.length === 0)
      return [];

    // finally we check if we have something worth showing.
    const displayData = workflow.lc_data.filter(
      lc_data => lc_data.value && lc_data.display_type === "normal"
    );

    return displayData;
  }

  get workflowId() {
    return (
      this.props.workflowIdFromPropsForModal ||
      parseInt(this.props.match.params.id, 10)
    );
  }

  get isLoadingStepData() {
    return (
      lodashGet(
        this.props,
        // TODO: Fix this
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

  get stepAndGroupFromURL() {
    const searchString = lodashGet(this.props, "location.search", "");
    const urlParams = new URLSearchParams(searchString);
    return {
      stepId: urlParams.get("step"),
      groupId: urlParams.get("group")
    };
  }

  get defaultStepTag() {
    return lodashGet(this.props, "workflowItem.definition.default_step", null);
  }

  // TODO: Should be optimized
  get allSteps() {
    return this.stepGroups.flatMap(group => group.steps).map(step => step.id);
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    // Get basic details about the workflow
    const basicWorkflowDetailsPromise = this.props.dispatch(
      workflowDetailsActions.getById(this.workflowId)
    );

    // Get all steps
    const stepsDataPromise = this.props.dispatch(
      workflowDetailsActions.getStepGroup(this.workflowId)
    );

    wdLog("resolving details and stepgroups api calls");
    Promise.all([basicWorkflowDetailsPromise, stepsDataPromise]).then(() => {
      // The component has been re-rendered here with the data from the API
      // Think :tongue_stuck_out:
      const {
        stepId: currentStepId,
        groupId: currentGroupId
      } = this.decideCurrentStep();
      wdLog(
        "componentDidMount",
        "current step and group will be",
        currentStepId,
        currentGroupId
      );

      // To update state and do more side effects
      this.handleUpdateOfActiveStep(currentGroupId, currentStepId);
    });
  }

  // This is one big ass method to decide what step should be rendered
  decideCurrentStep = () => {
    const {
      stepId: stepIdFromURL,
      groupId: groupIdFromURL
    } = this.stepAndGroupFromURL;

    // Always give first priority to the URL params
    if (stepIdFromURL && groupIdFromURL) {
      return {
        stepId: stepIdFromURL,
        groupId: groupIdFromURL
      };
    }

    // Second priority is given to the step from the config
    // if ther is any
    if (this.defaultStepTag) {
      const {
        stepId: defaultStepId,
        groupId: defaultGroupId
      } = getStepAndFromConfig(this.defaultStepTag, this.stepGroups);

      if (defaultStepId && defaultGroupId) {
        return { stepId: defaultStepId, groupId: defaultGroupId };
      }
    }

    // Third priority is given to lc data
    // first step should ne visible if there is no lc data
    if (!this.lcData.length) {
      return {
        groupId: this.stepGroups[0].id,
        stepId: this.stepGroups[0].steps[0].id
      };
    }

    // Lastly if there is nothing set profile as the selected step
    return { stepId: null, groupId: null };
  };

  // TODO: Remove this fn
  updateStepsInState = ({ currentGroupId, currentStepId }) => {
    // wdLog("updateStepsInState", currentGroupId, currentStepId);
    // this.setState({
    //   currentGroupId,
    //   currentStepId
    // });
  };

  // TODO: Don't forget to take care of this case
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

  displayProfile(stepId, groupId) {
    return stepId === null && groupId == null;
  }

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

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

  showComments = () => {
    const commentsData = lodashGet(this.props, "workflowComments.data", null);
    return commentsData && commentsData.results && !commentsData.isEmbedded;
  };

  selectActiveStep = (step_id, stepGroup_id) => {
    this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
  };

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  getStepDetailsData = payload => {
    wdLog("getStepDetailsData", "fetching step data", JSON.stringify(payload));
    this.props.dispatch(workflowDetailsActions.getStepFields(payload));
  };

  handleUpdateOfActiveStep = (groupId, stepId) => {
    wdLog("handleUpdateOfActiveStep", groupId, stepId);
    // URL should be changed when in expand view
    if (!this.props.minimalUI) {
      const isProfileStep = this.displayProfile(stepId, groupId);
      const searchParams = isProfileStep
        ? ""
        : new URLSearchParams({
            group: groupId,
            step: stepId
          });
      wdLog(
        "handleUpdateOfActiveStep",
        "redirecting to url",
        searchParams.toString()
      );
      history.replace({
        search: searchParams.toString()
      });
    }
    this.updateStepsInState({
      currentGroupId: groupId,
      currentStepId: stepId
    });

    // Fetch the step Data
    this.getStepDetailsData({
      workflowId: this.workflowId,
      groupId,
      stepId
    });
  };

  handleProfileClick = () => {
    this.handleUpdateOfActiveStep(null, null);
  };

  showBackButton = () => {
    return !this.props.minimalUI;
  };

  renderBackButton = () => {
    return (
      <div
        className={css`
          background-color: #104774;
          width: ${BACK_BUTTON_WIDTH};
          padding-top: 30px;
          margin-right: ${BACK_BUTTON_MARGIN_RIGHT};
        `}
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

  // Only fetches the data
  handleOnInView = (stepId, groupId) => {
    wdLog("handleOnInView", stepId, groupId);
    // if (!stepId && !groupId) {
    //   return this.handleUpdateOfActiveStep(null, null);
    // }
    // this.handleUpdateOfActiveStep(groupId, stepId);

    if (!stepId && !groupId) {
      return;
    }
    this.getStepDetailsData({ workflowId: this.workflowId, stepId, groupId });
  };

  getStepsContainerWidth = () => {
    const { minimalUI } = this.props;
    const contianerWidth = minimalUI ? MODAL_WIDTH : "100vw";
    return `calc(${contianerWidth} - ${BACK_BUTTON_WIDTH}  - ${BACK_BUTTON_MARGIN_RIGHT} - ${WORKFLOW_DETAILS_SIDEBAR_WIDTH} - ${WORKFLOW_DETAILS_CONTAINER_PADDING_RIGHT})`;
  };

  getStepContainerLeftPosition = () => {
    return `calc(${BACK_BUTTON_WIDTH} + ${BACK_BUTTON_MARGIN_RIGHT} + ${WORKFLOW_DETAILS_SIDEBAR_WIDTH})`;
  };

  render = () => {
    const { minimalUI, workflowItem } = this.props;
    const {
      stepId: currentStepId,
      groupId: currentGroupId
    } = this.stepAndGroupFromURL;
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
            className={css`
              min-height: 100vh;
              padding: 60px ${WORKFLOW_DETAILS_CONTAINER_PADDING_RIGHT} 0
                ${WORKFLOW_DETAILS_CONTAINER_PADDING_LEFT};
            `}
          >
            {this.showBackButton() && this.renderBackButton()}

            <SidebarView
              selectedGroup={currentGroupId}
              selectedStep={currentStepId}
              minimalUI={minimalUI}
              workflowIdFromDetailsToSidebar={this.workflowId}
              onUpdateOfActiveStep={this.handleUpdateOfActiveStep}
              displayProfile={this.displayProfile(
                currentStepId,
                currentGroupId
              )}
              changeProfileDisplay={this.handleProfileClick}
            />
            <Content
              className={css`
                width: ${this.getStepsContainerWidth()};
                margin-top: 12px;
                padding-left: 10px;
                /* position: absolute; */
                /* left: ${this.getStepContainerLeftPosition()}; */
              `}
            >
              <div className="printOnly ">
                <div
                  style={{
                    background: "transparent",
                    margin: minimalUI ? "0px 24px 0px 0px" : "24px"
                  }}
                >
                  {/* For the profile step */}
                  <NextStepPlaceholder
                    onInViewCallback={() => this.handleOnInView(null, null)}
                  >
                    <StepBody
                      stepId={null}
                      workflowId={this.workflowId}
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
                      displayProfile={true}
                    />
                  </NextStepPlaceholder>
                  {/* TODO: Clean the JSX */}
                  {!this.props.hideStepBody &&
                    this.stepGroups.map(group => {
                      return group.steps.map(step => (
                        <NextStepPlaceholder
                          onInViewCallback={() =>
                            this.handleOnInView(step.id, group.id)
                          }
                          key={step.id}
                        >
                          <StepBody
                            stepId={step.id}
                            workflowId={this.workflowId}
                            toggleSidebar={this.callBackCollapser}
                            changeFlag={this.changeFlag}
                            getIntegrationComments={this.getIntegrationComments}
                            workflowHead={
                              minimalUI
                                ? workflowItem
                                : this.props.workflowDetailsHeader[
                                    this.workflowId
                                  ]
                                ? this.props.workflowDetailsHeader[
                                    this.workflowId
                                  ]
                                : null
                            }
                            dispatch={this.props.dispatch}
                            displayProfile={false}
                          />
                        </NextStepPlaceholder>
                      ));
                    })}
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
