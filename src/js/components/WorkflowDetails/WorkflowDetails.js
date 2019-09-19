import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
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
import LazyLoadHOC from "./LazyLoadHOC";
import WhenInViewHOC from "./WhenInViewHOC";
import { css } from "emotion";

const { Content } = Layout;

/**
 * TODOs:
 * [x] Scroll up syncing of step with sidebar
 * [] Quick view testing
 * [] All other todos
 * [] Smooth user experience while scrolling down
 * [x] UI fixes
 */

const namespacedLogger = (namespace, turnOff = false) => (...args) => {
  !turnOff && console.debug(namespace, ...args);
};

const wdLog = namespacedLogger("WorkflowDetails");

class WorkflowDetails extends Component {
  state = {
    currentGroupId: null,
    currentStepId: null
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Lifecycle Methods

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

  ////////////////////////////////////////////////////////////////////////////////
  // Getters
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

  get worklfowHead() {
    const { minimalUI, workflowItem } = this.props;
    return minimalUI
      ? workflowItem
      : lodashGet(
          this.props,
          `workflowDetailsHeader[${this.workflowId}]`,
          null
        );
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Helpers

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

  // Set the passed groupId and stepId as the current step and group
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
      stepId,
      groupId
    });
  };

  updateStepsInState = ({ groupId, stepId }) => {
    wdLog("updateStepsInState", groupId, stepId);
    this.setState({
      currentGroupId: groupId,
      currentStepId: stepId
    });
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

  // payload: {workflowId, stepId, groupId}
  getStepDetailsData = payload => {
    wdLog("getStepDetailsData", "fetching step data", JSON.stringify(payload));
    this.props.dispatch(workflowDetailsActions.getStepFields(payload));
  };

  // Check whether the profile is selected, based on current step and group id
  displayProfile(stepId, groupId) {
    return stepId === null && groupId == null;
  }

  // Handles the click on profile
  // Just the update the current step and group
  handleProfileClick = () => {
    this.handleUpdateOfActiveStep(null, null);
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

  // Callback to lazy load the data
  // Only fetches the data
  handleOnInView = (stepId, groupId) => {
    wdLog("handleOnInView", stepId, groupId);

    if (!stepId && !groupId) {
      return;
    }
    this.getStepDetailsData({ workflowId: this.workflowId, stepId, groupId });
  };

  // Update the new step and group when the user scrolls to it
  handlTouchTop = (stepId, groupId) => {
    wdLog("handlTouchTop", stepId, groupId);
    if (!stepId && !groupId) {
      return this.handleUpdateOfActiveStep(null, null);
    }
    this.handleUpdateOfActiveStep(groupId, stepId);
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Sub render methods

  renderBackButton = (
    <div
      className={css`
        background-color: #104774;
        width: 70px;
        padding-top: 30px;
        margin-right: 20px;
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

  nextStepPlaceholder = (
    <div
      className={css`
        background: white;
        min-height: 60vh;
        margin-bottom: 40px;
        background-color: white;
        box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.09);
      `}
    ></div>
  );

  renderProfileStep = () => {
    return (
      <WhenInViewHOC onInViewCallback={() => this.handlTouchTop(null, null)}>
        <LazyLoadHOC
          onInViewCallback={() => this.handleOnInView(null, null)}
          defaultElem={this.nextStepPlaceholder}
          threshold={0.2}
        >
          {/* FIXME: 
              This styling should not be its part, but can't
              restyle step body form now :pensive: 

              See if this can be moved to stepbody now :confused:
          */}
          <div style={{ marginBottom: 40 }}>
            <StepBody
              stepId={null}
              workflowId={this.workflowId}
              toggleSidebar={this.callBackCollapser}
              changeFlag={this.changeFlag}
              getIntegrationComments={this.getIntegrationComments}
              workflowHead={this.worklfowHead}
              dispatch={this.props.dispatch}
              displayProfile={true}
            />
          </div>
        </LazyLoadHOC>
      </WhenInViewHOC>
    );
  };

  renderAllStepData = () => {
    return this.stepGroups.map(group => {
      return group.steps.map(step => (
        <WhenInViewHOC
          onInViewCallback={() => this.handlTouchTop(step.id, group.id)}
        >
          <LazyLoadHOC
            threshold={0.2}
            onInViewCallback={() => this.handleOnInView(step.id, group.id)}
            key={step.id}
            defaultElem={this.nextStepPlaceholder}
          >
            {/* FIXME: 
              This styling should not be its part, but can't
              restyle step body form now :pensive: 

              See if this can be moved to stepbody now :confused:
            */}
            <div style={{ marginBottom: 40 }}>
              <StepBody
                stepId={step.id}
                workflowId={this.workflowId}
                toggleSidebar={this.callBackCollapser}
                changeFlag={this.changeFlag}
                getIntegrationComments={this.getIntegrationComments}
                workflowHead={this.worklfowHead}
                dispatch={this.props.dispatch}
                displayProfile={false}
              />
            </div>
          </LazyLoadHOC>
        </WhenInViewHOC>
      ));
    });
  };

  render = () => {
    const { minimalUI } = this.props;
    const { currentStepId, currentGroupId } = this.state;
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
              padding: 60px 10px 0 0;
            `}
          >
            {!minimalUI && this.renderBackButton}

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
                flex: 1;
                margin-top: 12px;
                padding-left: 10px;
              `}
            >
              {/* TODO: Check if this is required */}
              <div className="printOnly">
                <div
                  style={{
                    // TODO: Check if this is required
                    background: "transparent",
                    margin: minimalUI ? "0px 24px 0px 0px" : "24px"
                  }}
                >
                  {/* For the profile step */}
                  {this.renderProfileStep()}

                  {/* TODO: Clean the JSX */}
                  {!this.props.hideStepBody && this.renderAllStepData()}
                </div>
              </div>

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

  // TODO: These methods need to be refactored when the `Comments` component is looked at
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

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
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
