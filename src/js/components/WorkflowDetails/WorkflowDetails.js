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
import { workflowService } from "../../services";
import Comments from "./comments";
import { FormattedMessage, injectIntl } from "react-intl";
import { goToPrevStep } from "../../utils/customBackButton";
import { get as lodashGet } from "lodash";
import {
  getStepAndGroupFromConfig,
  getNextStepAndGroup
} from "./utils/active-step";
import LazyLoadHOC from "./LazyLoadHOC";
import WhenInViewHOC from "./WhenInViewHOC";
import { css } from "emotion";
import {
  checkPermission,
  Chowkidaar
} from "../../../modules/common/permissions/Chowkidaar";
import Permissions from "../../../modules/common/permissions/permissionsList";
import showNotification from "../../../modules/common/notification";
import { getFilteredStepGroups } from "../../../modules/workflows/sidebar/sidebar.selectors";

const { Content } = Layout;

class WorkflowDetails extends Component {
  state = {
    currentGroupId: null,
    currentStepId: null,
    hasLoadedAllData: false,
    stepUserTagData: []
  };

  // Loads all the required data
  // Decide the default step
  initializeComponent = () => {
    // Get basic details about the workflow
    const basicWorkflowDetailsPromise = this.props.dispatch(
      workflowDetailsActions.getById(this.workflowId)
    );

    // Get all steps
    const stepsDataPromise = this.props.dispatch(
      workflowDetailsActions.getStepGroup(this.workflowId)
    );

    this.getStepUserTag();

    Promise.all([basicWorkflowDetailsPromise, stepsDataPromise])
      .then(([workflowResponse]) => {
        // The component has been re-rendered here with the data from the API
        // Think :tongue_stuck_out:

        const {
          stepId: currentStepId,
          groupId: currentGroupId
        } = this.decideCurrentStep();

        this.setState({ hasLoadedAllData: true }, () => {
          // To update state and do more side effects
          this.scrollElementIntoView(currentGroupId, currentStepId);
        });
      })
      .catch(error => {
        if (error === 404) this.handleWorkflowNotFound();
      });
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Lifecycle Methods

  componentDidMount() {
    this.initializeComponent();
  }

  componentDidUpdate(previousProps) {
    const { currentGroupId, currentStepId } = this.state;

    // Auto submit
    if (this.isTheStepAutoSubmitted(previousProps, this.props, currentStepId)) {
      const [groupId, stepId] = getNextStepAndGroup(
        currentGroupId,
        currentStepId,
        this.props.stepGroups
      );
      this.scrollElementIntoView(groupId, stepId);
    }

    // navigate to new workflow
    if (
      previousProps.match &&
      this.props.match &&
      previousProps.match.params.id !== this.props.match.params.id
    ) {
      this.initializeComponent();
    }

    if (this.props.location !== previousProps.location) {
      const { stepId, groupId } = this.stepAndGroupFromURL;
      const { currentGroupId, currentStepId } = this.state;
      // eslint-disable-next-line
      if (currentStepId != stepId && currentGroupId != groupId) {
        setTimeout(() => this.scrollElementIntoView(groupId, stepId));
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters
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
    return lodashGet(
      this.props,
      "workflowItem.definition.default_step_tag",
      null
    );
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
  handleWorkflowNotFound = () => {
    const { minimalUI, closeModal } = this.props;
    const workflowId = this.workflowId;
    showNotification({
      type: "error",
      message: "errorMessageInstances.ws002",
      messageData: {
        workflowId
      },
      description: "errorMessageInstances.errorCode",
      descriptionData: {
        errorCode: "WS002"
      },
      key: workflowId,
      duration: 0
    });
    if (!minimalUI) {
      goToPrevStep();
    } else {
      closeModal();
    }
  };

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
      } = getStepAndGroupFromConfig(this.defaultStepTag, this.props.stepGroups);

      if (defaultStepId && defaultGroupId) {
        return { stepId: defaultStepId, groupId: defaultGroupId };
      }
    }

    // Third priority is given to lc data
    // first step should ne visible if there is no lc data
    // or if user doesn't have permission to view profile
    if (
      !this.lcData.length ||
      !checkPermission({
        permissionsAllowed: this.props.permissions.permissions,
        permissionName: Permissions.CAN_VIEW_WORKFLOW_PROFILE
      })
    ) {
      return {
        groupId: this.props.stepGroups[0].id,
        stepId: this.props.stepGroups[0].steps[0].id
      };
    }

    // Lastly if there is nothing set profile as the selected step
    return { stepId: null, groupId: null };
  };

  // Set the passed groupId and stepId as the current step and group
  handleUpdateOfActiveStep = (groupId, stepId) => {
    // Don't update any data until all the data is loaded
    if (!this.state.hasLoadedAllData) {
      return;
    }

    // URL should be changed when in expand view
    if (!this.props.minimalUI) {
      const isProfileStep = this.displayProfile(stepId, groupId);
      const searchParams = isProfileStep
        ? ""
        : new URLSearchParams({
            group: groupId,
            step: stepId
          });
      history.replace({
        search: searchParams.toString()
      });
    }
    this.setState({
      currentStepId: stepId,
      currentGroupId: groupId
    });
  };

  scrollElementIntoView = (groupId, stepId) => {
    // FIXME: Commenting out for toggling scrolling feature
    // Using 0 when null and/or undefined, assuming the user wants to navigate to the profile step
    // const elemId = `#step_body_${groupId || 0}_${stepId || 0}`;
    // const stepNode = document.querySelector(elemId);
    // if (stepNode) {
    //   // Scrolling it to 80px from top
    //   const y = stepNode.offsetTop - 80;
    //   window.scrollTo({
    //     top: y,
    //     left: 0
    //   });
    // } else {
    //   console.log("cant find step");
    // }

    // Optimization Alert: Updating state here also,
    // for quick reflection in the UI
    this.setState({
      currentStepId: stepId,
      currentGroupId: groupId
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
    this.props.dispatch(workflowDetailsActions.getStepFields(payload));
  };

  // Check whether the profile is selected, based on current step and group id
  displayProfile(stepId, groupId) {
    return stepId === null && groupId == null;
  }

  // Handles the click on profile
  // Just the update the current step and group
  handleProfileClick = () => {
    this.scrollElementIntoView(null, null);
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
    if (!stepId && !groupId) {
      return;
    }
    this.getStepDetailsData({ workflowId: this.workflowId, stepId, groupId });
  };

  // Update the new step and group when the user scrolls to it
  handleTouchTop = (stepId, groupId) => {
    if (!stepId && !groupId) {
      return this.handleUpdateOfActiveStep(null, null);
    }
    this.handleUpdateOfActiveStep(groupId, stepId);
  };

  getStepUserTag = () => {
    workflowService
      .getStepUserTagDetail(this.props.workflowId)
      .then(response => {
        this.setState({
          stepUserTagData: response.results
        });
      })
      .catch(error => {
        console.log(error);
      });
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
      <WhenInViewHOC
        id="step_body_0_0"
        onInViewCallback={() => this.handleTouchTop(null, null)}
        extra={null}
      >
        <LazyLoadHOC
          onInViewCallback={() => this.handleOnInView(null, null)}
          defaultElement={this.nextStepPlaceholder}
          threshold={0.1}
          rootStyle={{ marginBottom: 40 }}
        >
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
        </LazyLoadHOC>
      </WhenInViewHOC>
    );
  };

  renderAllStepData = (groupId, stepId) => {
    // FIXME: Commenting out for toggling scrolling feature
    // return this.props.stepGroups.map(group => {
    //   return group.steps.map(step => (
    return (
      <WhenInViewHOC
        id={`step_body_${groupId}_${stepId}`}
        onInViewCallback={() => this.handleTouchTop(stepId, groupId)}
        // extra={step.name}
      >
        <LazyLoadHOC
          threshold={0.2}
          onInViewCallback={() => this.handleOnInView(stepId, groupId)}
          key={stepId}
          defaultElement={this.nextStepPlaceholder}
          rootStyle={{ marginBottom: 40 }}
        >
          <StepBody
            stepId={stepId}
            workflowId={this.workflowId}
            toggleSidebar={this.callBackCollapser}
            changeFlag={this.changeFlag}
            getIntegrationComments={this.getIntegrationComments}
            workflowHead={this.worklfowHead}
            dispatch={this.props.dispatch}
            displayProfile={false}
            // stepName={step.name}
          />
        </LazyLoadHOC>
      </WhenInViewHOC>
    );
    // ));
    // });
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
              padding: ${minimalUI ? "120px 10px 0 0" : "60px 10px 0 0"};
            `}
          >
            {!minimalUI && this.renderBackButton}

            <SidebarView
              selectedGroup={currentGroupId}
              selectedStep={currentStepId}
              minimalUI={minimalUI}
              workflowIdFromDetailsToSidebar={this.workflowId}
              onUpdateOfActiveStep={this.scrollElementIntoView}
              displayProfile={this.displayProfile(
                currentStepId,
                currentGroupId
              )}
              changeProfileDisplay={this.handleProfileClick}
            />
            <Content
              className={css`
                flex: 1;
                margin-top: 25px;
                padding-left: 10px;
              `}
            >
              {/* This class is for adding print-only styles */}
              <div className="printOnly">
                {/* FIXME: Commenting out for toggling scrolling feature */}
                <Chowkidaar check={Permissions.CAN_VIEW_WORKFLOW_PROFILE}>
                  {!currentStepId && this.renderProfileStep()}
                </Chowkidaar>
                {!!currentStepId &&
                  !this.props.hideStepBody &&
                  this.renderAllStepData(currentGroupId, currentStepId)}
              </div>

              {this.showComments() && (
                <div>
                  <Comments
                    object_id={this.state.object_id}
                    toggleSidebar={this.callBackCollapser}
                    addComment={this.addComment}
                    gotoStep={this.fetchStepData}
                    selectActiveStep={this.scrollElementIntoView}
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

  // FIXME: These methods need to be refactored when the `Comments` component is looked at
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  /// this will be moved to another component///
  callBackCollapser = (objectId, content_type, isEmbeddedDetails) => {
    // FIXME: Here it's called with no parameters when the comment section is
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

function mapStateToProps(state, props) {
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
    permissions
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
    permissions,
    stepGroups: getFilteredStepGroups(
      // reselect selector
      state,
      props.workflowIdFromPropsForModal || parseInt(props.match.params.id, 10)
    )
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
