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

  get displayProfile() {
    const { currentGroupId, currentStepId } = this.state;
    return currentGroupId === null && currentStepId == null;
  }

  // TODO: Should be optimized
  get allSteps() {
    return this.stepGroups.flatMap(group => group.steps).map(step => step.id);
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  state = {
    currentStepId: null
    // currentGroupId: null,
    // nextStepId: null,
    // nextGroupId: null
  };

  componentDidMount() {
    // Get basic details about the workflow
    const basicWorkflowDetailsPromise = this.props.dispatch(
      workflowDetailsActions.getById(this.workflowId)
    );

    // Get all steps
    const stepsDataPromise = this.props.dispatch(
      workflowDetailsActions.getStepGroup(this.workflowId)
    );

    Promise.all([basicWorkflowDetailsPromise, stepsDataPromise]).then(() => {
      // The component has been re-rendered here with the data from the API
      // Think :tongue_stuck_out:
      const {
        stepId: currentStepId,
        groupId: currentGroupId
      } = this.decideCurrentStep();
      console.log("componentDidMount", currentStepId, currentGroupId);

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

  updateStepsInState = ({ currentGroupId, currentStepId }) => {
    this.setState({
      currentGroupId,
      currentStepId
    });
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
    this.props.dispatch(workflowDetailsActions.getStepFields(payload));
  };

  handleUpdateOfActiveStep = (groupId, stepId, softUpdate = false) => {
    // URL should be changed when in expand view
    if (!this.props.minimalUI) {
      const isProfileStep = groupId === null && stepId === null;
      const searchParams = isProfileStep
        ? ""
        : new URLSearchParams({
            group: groupId,
            step: stepId
          });
      history.replace({
        search: searchParams.toString(),
        state: softUpdate
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

  handleOnInView = (stepId, groupId) => {
    if (!stepId && !groupId) {
      return this.handleUpdateOfActiveStep(null, null);
    }
    this.handleUpdateOfActiveStep(groupId, stepId);
  };

  render = () => {
    const { minimalUI, workflowItem } = this.props;
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
                selectedGroup={currentGroupId}
                selectedStep={currentStepId}
                minimalUI={minimalUI}
                workflowIdFromDetailsToSidebar={this.workflowId}
                onUpdateOfActiveStep={this.handleUpdateOfActiveStep}
                displayProfile={this.displayProfile}
                changeProfileDisplay={this.handleProfileClick}
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
                    {/* TODO: Clean the JSX */}
                    {!this.props.hideStepBody &&
                      this.stepGroups.map(group => {
                        return group.steps.map((step, index) => (
                          <NextStepPlaceholder
                            onInViewCallback={() =>
                              this.handleOnInView(step.id, group.id)
                            }
                          >
                            <StepBody
                              stepId={step.id}
                              workflowId={this.workflowId}
                              toggleSidebar={this.callBackCollapser}
                              changeFlag={this.changeFlag}
                              getIntegrationComments={
                                this.getIntegrationComments
                              }
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
                              displayProfile={this.displayProfile}
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
