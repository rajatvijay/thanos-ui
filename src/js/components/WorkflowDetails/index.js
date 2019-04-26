import React, { Component } from "react";
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
  logout,
  navbarActions,
  configActions,
  checkAuth
} from "../../actions";
import { WorkflowHeader } from "../Workflow/workflow-item";
import Comments from "./comments";
import { veryfiyClient } from "../../utils/verification";
import { FormattedMessage, injectIntl } from "react-intl";
import BreadCrums from "./BreadCrums";
import StepPreview from "../Workflow/StepPreview";
import { calculatedData } from "../Workflow/calculated-data";

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
      firstLoad: true
    };

    this.preConstruct();
  }

  preConstruct = () => {
    let params = this.props.location.search;
    let qs = this.props.location.state
      ? this.props.location.state
      : this.queryStringToObject(params);

    this.props.location.search = "";

    if (!_.isEmpty(qs)) {
      this.state.selectedStep = qs.step;
      this.state.selectedGroup = qs.group;
      this.state.from_params = true;
    }
    if (qs.object_id && qs.type) {
      this.props.dispatch(
        workflowDetailsActions.getComment(qs.object_id, qs.type)
      );
    }

    if (!_.isEmpty(qs)) {
      this.props.dispatch(workflowDetailsActions.setCurrentStepId(qs));
    }

    if (
      !this.props.config.configuration ||
      this.props.config.error ||
      !_.size(this.props.config.permission)
    ) {
      this.props.dispatch(configActions.getConfig());
    }
  };

  //DEFINITELY NEED TO SIMPLY THIS CODE
  currentActiveStep = wfd => {
    if (this.props.hasStepinfo.stepInfo) {
      let stepinfo = this.props.hasStepinfo.stepInfo;
      this.props.dispatch(workflowDetailsActions.removeCurrentStepId());
      return {
        activeStepGroup: stepinfo.group,
        activeStep: stepinfo.step
      };
    } else {
      let activeStepGroup = null;
      let activeStep = null;

      _.forEach(wfd.stepGroups.results, function(step_group) {
        if (step_group.is_complete || _.isEmpty(step_group.steps)) {
          return;
        }
        activeStepGroup = step_group;
        _.forEach(step_group.steps, function(step) {
          if (step.is_editable && !step.completed_at && !step.is_locked) {
            activeStep = step;
            return false;
          }
        });
        if (activeStep) {
          return false;
        }
      });

      // this conditions is satisfied only when all step groups are completed
      if (!activeStepGroup) {
        let last_sg_index = wfd.stepGroups.results.length - 1;
        activeStepGroup = wfd.stepGroups.results[last_sg_index];
        let last_step_index = activeStepGroup.steps.length - 1;
        activeStep = activeStepGroup.steps[last_step_index];
      }

      // this condition will occur when step is available but steps inside are not available for edit (i.e. locked/completed)
      if (activeStepGroup && !activeStep) {
        let last_step_index = activeStepGroup.steps.length - 1;
        activeStep = activeStepGroup.steps[last_step_index];
      }

      if (activeStep) {
        return {
          activeStepGroup: activeStepGroup.id,
          activeStep: activeStep.id
        };
      } else {
        let actStepGrp = wfd.stepGroups.results[0];
        let actStep = wfd.stepGroups.results[0].steps[0];
        return {
          activeStepGroup: actStepGrp && actStepGrp.id,
          activeStep: actStep && actStep.id
        };
      }
    }
  };

  //componentDidUpdate = prevProps => {// Change the following to component did mount in future.
  componentWillReceiveProps = nextProps => {
    if (
      !_.size(nextProps.workflowDetailsHeader.error) &&
      !_.size(this.props.workflowDetailsHeader.error) &&
      nextProps.workflowDetails.loading === false &&
      this.props.workflowDetails.workflowDetails !==
        nextProps.workflowDetails.workflowDetails
    ) {
      let wfd = nextProps.workflowDetails.workflowDetails;

      let wf_id = parseInt(this.props.match.params.id, 10);

      let stepTrack = null;
      if (
        this.state.selectedStep &&
        this.state.selectedGroup &&
        this.state.from_params
      ) {
        stepTrack = {
          workflowId: wf_id,
          groupId: this.state.selectedGroup,
          stepId: this.state.selectedStep
        };
        this.state.from_params = false;
      } else {
        let stepGroup_id = null;
        let step_id = null;
        let active_step_data = this.currentActiveStep(wfd);

        stepGroup_id = active_step_data["activeStepGroup"];
        step_id = active_step_data["activeStep"];
        if (!step_id) {
          this.setState({ error: "errorMessageInstances.noStepInWorkflow" });
          return;
        }

        stepTrack = {
          workflowId: wf_id,
          groupId: stepGroup_id,
          stepId: step_id
        };

        this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
      }

      if (!this.state.loading_sidebar && !this.state.dont) {
        this.setState({ dont: true }); //Prevent unnecessary reloading of steps
        this.fetchStepData(stepTrack);
      }
    }

    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.preConstruct();
      this.forceUpdate();
      // this.getInitialData();
    }
  };

  componentDidMount = () => {
    this.props.dispatch(workflowActions.expandedWorkflowsList([]));
    this.props.dispatch(navbarActions.showFilterMenu());
    this.getInitialData();
    this.setState({});
  };

  componentDidUpdate = prevProps => {
    let thisCurrent = this.props.currentStepFields;
    let prevCurrent = prevProps.currentStepFields;

    if (this.props.location !== prevProps.location) {
      this.preConstruct();
      this.getInitialData();
    }

    if (
      this.props.currentStepFields.currentStepFields &&
      this.props.currentStepFields.currentStepFields.step_group &&
      this.props.workflowDetailsHeader.workflowDetailsHeader
    ) {
      this.syncStepCompletion();
    }

    //SET THE UPDATE PREVENTING VARIABLE TO FALSE IF STEP IS BEING
    //SUBMITTED SO NEW DATA UPDATES IN SIDEBAR AND IN MAIN FORM
    if (thisCurrent.isSubmitting !== prevCurrent.isSubmitting) {
      this.setState({ dont: false });
    }

    if (
      thisCurrent.currentStepFields &&
      this.props.workflowDetailsHeader.workflowDetailsHeader &&
      prevCurrent.currentStepFields !== thisCurrent.currentStepFields
    ) {
      let progress = getProgressData(
        this.props.workflowDetailsHeader.workflowDetailsHeader
      );

      if (progress === 100 && !this.state.firstLoad) {
        this.navigateLevelBack();
      }

      this.setState({ firstLoad: false });
      this.updateURL();
    }

    //Update url on step change
    if (
      thisCurrent.currentStepFields &&
      thisCurrent.currentStepFields.id !== prevCurrent.currentStepFields.id
    ) {
      this.updateURL();
    }
  };

  updateURL = () => {
    let currentStep = this.props.currentStepFields.currentStepFields;
    let currentPath = document.location.pathname;
    let group = currentStep.step_group;
    let step = currentStep.id;
    let urlPath = `${currentPath}?group=${group}&step=${step}`;
    window.history.pushState("", "", urlPath);
  };

  navigateLevelBack = () => {
    const wf = this.props.workflowDetailsHeader.workflowDetailsHeader;
    const size = _.size(wf.workflow_family);
    if (size > 1) {
      history.push("/workflows/instances/" + wf.workflow_family[size - 2].id);
    }
  };

  syncStepCompletion = () => {
    let currentStep = this.props.currentStepFields.currentStepFields;
    let workflowData = this.props.workflowDetailsHeader.workflowDetailsHeader;

    let sbGroup = _.find(workflowData.step_groups, group => {
      return group.id === currentStep.step_group;
    });

    if (sbGroup) {
      let sbStep = _.find(sbGroup.steps, step => {
        return step.id === currentStep.id;
      });

      if (sbStep && sbStep.completed_at !== currentStep.completed_at) {
        this.getInitialData();
      }
    }
  };

  getInitialData = () => {
    if (!this.props.users.me) {
      this.checkAuth();
    }

    if (!veryfiyClient(this.props.authentication.user.csrf)) {
      this.props.dispatch(logout());
    }

    var that = this;
    var id = parseInt(that.props.match.params.id, 10);

    this.props.dispatch(workflowDetailsActions.getStepGroup(id));
    //Get workflow  basic data ( need to move this
    this.getHeaderData();
    this.props.dispatch(workflowFiltersActions.getStatusData());
    window.scrollTo(0, 0);
  };

  checkAuth = () => {
    this.props.dispatch(checkAuth());
  };

  //Quesry string  to object
  queryStringToObject = qs => {
    if (qs[0] === "?") {
      qs = qs.slice(1);
    }
    var obj = {};
    _.each(qs.split("&"), function(param) {
      if (param !== "") {
        param = param.split("=");
        var name = param[0];
        var value = param[1];
        var old_value = obj[name];
        if (old_value === undefined) {
          obj[name] = value;
        } else {
          if (_.isArray(old_value)) {
            old_value.push(value);
            obj[name] = old_value;
          } else {
            var new_value = [old_value, value];
            obj[name] = new_value;
          }
        }
      }
    });
    return obj;
  };

  onStepSelected = cb => {
    this.getStepData(cb.key);
  };

  getStepData = data => {
    let wf_id = parseInt(this.props.match.params.id, 10);
    let stepMeta = data.split("_");
    let stepTrack = {
      workflowId: wf_id,
      groupId: stepMeta[0],
      stepId: stepMeta[1]
    };

    this.fetchStepData(stepTrack);
  };

  selectActiveStep = (step_id, stepGroup_id) => {
    this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
  };

  fetchStepData = payload => {
    this.props.dispatch(workflowDetailsActions.getStepFields(payload));
  };

  getHeaderData = () => {
    let id = parseInt(this.props.match.params.id, 10);
    return this.props.dispatch(workflowDetailsActions.getById(id));
  };

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

  toggleRightSidebar = () => {
    this.props.dispatch(
      navbarActions.toggleRightSidebar(!this.props.showPreviewSidebar.show)
    );
  };

  isParentWorkflow = () => {
    return (
      this.props.workflowDetailsHeader.workflowDetailsHeader.workflow_family
        .length === 1
    );
  };

  render = () => {
    let stepLoading = this.props.workflowDetails.loading;
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
              marginLeft: 320,
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
            {this.props.workflowDetailsHeader.loading ||
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
              defaultSelectedKeys={this.state.selectedStep}
              defaultOpenKeys={this.state.selectedGroup}
              onStepSelected={this.onStepSelected.bind(this)}
              loading={stepLoading}
              alerts={
                this.props.workflowDetailsHeader.workflowDetailsHeader
                  ? this.props.workflowDetailsHeader.workflowDetailsHeader
                      .alerts
                  : null
              }
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
            {/*
                <Sider
                  collapsible
                  defaultCollapsed={true}
                  collapsed={this.props.showPreviewSidebar && this.props.showPreviewSidebar.show }
                  theme="light"
                  width={400}
                  trigger={null}
                  collapsedWidth={0}
                  style={{
                    overflow: "auto",
                    background: "#fcfdff",
                    boxShadow:"0 0 4px  #ddd"
                  }}
                  >
                  <div className="bg-secondary text-white pd-ard-sm">
                    <span className="float-right pd-ard-sm text-anchor" onClick={this.toggleRightSidebar}><i className="material-icons">close</i></span>
                    <span className="pd-ard-sm text-medium">Step Preview</span>
                  </div>
                  <div className="pd-ard-sm ">
                  <StepPreview />
                  </div>
                </Sider>
            */}
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
