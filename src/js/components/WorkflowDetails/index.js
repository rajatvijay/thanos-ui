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
  configActions,
  checkAuth
} from "../../actions";
import { WorkflowHeader } from "../Workflow/workflow-item";
import Comments from "./comments";
import { veryfiyClient } from "../../utils/verification";

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
      printing: false
    };

    this.preConstruct();
  }

  componentWillMount = () => {
    //this.preConstruct()
  };

  preConstruct = () => {
    let params = this.props.location.search;
    let qs = this.queryStringToObject(params);
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
          if (!step.completed_at && !step.is_locked) {
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
          activeStepGroup: activeStepGroup,
          activeStep: activeStep
        };
      } else {
        let actStepGrp = wfd.stepGroups.results[0];
        let actStep = wfd.stepGroups.results[0].steps[0];
        return {
          activeStepGroup: actStepGrp,
          activeStep: actStep
        };
      }
    }
  };

  //componentDidUpdate = prevProps => {
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
      let stepGroup_id = null;
      let step_id = null;
      let active_step_data = this.currentActiveStep(wfd);

      stepGroup_id = active_step_data["activeStepGroup"].id;
      step_id = active_step_data["activeStep"].id;

      let stepTrack = {
        workflowId: wf_id,
        groupId: stepGroup_id,
        stepId: step_id
      };

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
        this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
      }

      if (!this.state.loading_sidebar) {
        this.props.dispatch(workflowDetailsActions.getStepFields(stepTrack));
      }
    }

    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.preConstruct();
      this.forceUpdate();
      this.getInitialData();
    }
  };

  componentDidMount = () => {
    this.getInitialData();
  };

  componentDidUpdate = prevProps => {
    if (this.props.location !== prevProps.location) {
      this.preConstruct();
      this.getInitialData();
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

    this.props.dispatch(workflowDetailsActions.getStepFields(stepTrack));
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

  addComment = payload => {
    this.state.adding_comment = true;
    this.state.object_id = payload.object_id;
    this.props.dispatch(workflowStepActions.addComment(payload));
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

  render = () => {
    let stepLoading = this.props.workflowDetails.loading;
    let comment_data = this.props.workflowComments.data;

    if (_.size(this.props.workflowDetailsHeader.error)) {
      return (
        <Layout className="workflow-details-container inner-container">
          <div
            className="workflow-details-top-card vertical-padder-16 side-padder-16 bg-white"
            style={{
              position: "relative",
              zIndex: 1,
              boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.06)"
            }}
          />

          <StepSidebar />

          <Layout
            style={{
              marginLeft: 250,
              background: "#FBFBFF",
              minHeight: "100vh",
              paddingTop: "30px"
            }}
          >
            <div className="printOnly ">
              <div className="mr-ard-lg  shadow-1 bg-white" id="StepBody">
                <div className="text-center text-metal mr-ard-lg">
                  <br />
                  <br />
                  {this.props.workflowDetailsHeader.error === "Not Found"
                    ? "Sorry! We were unable to find the workflow you requested."
                    : this.props.workflowDetailsHeader.error}
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      );
    } else {
      return (
        <Layout className="workflow-details-container inner-container">
          <div
            className="workflow-details-top-card vertical-padder-16 side-padder-16 bg-white"
            style={{
              position: "relative",
              zIndex: 1,
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
                <WorkflowHeader
                  detailsPage={true}
                  kind={this.props.workflowKind}
                  workflow={
                    this.props.workflowDetailsHeader.workflowDetailsHeader
                  }
                  statusType={this.props.workflowFilterType.statusType}
                  showCommentIcon={true}
                  getCommentSidebar={this.callBackCollapser}
                />
              </div>
            )}
          </div>

          <StepSidebar
            step2={
              this.props.workflowDetails.workflowDetails
                ? this.props.workflowDetails.workflowDetails.stepGroups.results
                : null
            }
            defaultSelectedKeys={this.state.selectedStep}
            defaultOpenKeys={this.state.selectedGroup}
            onStepSelected={this.onStepSelected.bind(this)}
            loading={stepLoading}
          />

          <Layout
            style={{
              marginLeft: 250,
              background: "#FBFBFF",
              minHeight: "100vh",
              paddingTop: "30px"
            }}
          >
            <div className="printOnly ">
              <div className="mr-ard-lg  shadow-1 bg-white" id="StepBody">
                <StepBody
                  toggleSidebar={this.callBackCollapser}
                  changeFlag={this.changeFlag}
                  getIntegrationComments={this.getIntegrationComments}
                  workflowHead={
                    this.props.workflowDetailsHeader.workflowDetailsHeader
                      ? this.props.workflowDetailsHeader.workflowDetailsHeader
                      : "loading"
                  }
                />
              </div>
            </div>

            <div className="text-right pd-ard mr-ard-md">
              <Tooltip title="Scroll to top" placement="topRight">
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
          </Layout>

          {comment_data && _.size(comment_data.results) ? (
            <Comments
              object_id={this.state.object_id}
              toggleSidebar={this.callBackCollapser}
              addComment={this.addComment}
              gotoStep={this.fetchStepData}
              selectActiveStep={this.selectActiveStep}
              changeFlag={this.changeFlag}
              {...this.props}
            />
          ) : null}
        </Layout>
      );
    }
  };
}

function mapStateToProps(state) {
  const {
    workflowDetails,
    workflowDetailsHeader,
    workflowFilterType,
    workflowKind,
    workflowComments,
    authentication,
    hasStepinfo,
    users,
    config
  } = state;

  return {
    workflowDetails,
    workflowDetailsHeader,
    workflowFilterType,
    workflowKind,
    workflowComments,
    authentication,
    hasStepinfo,
    users,
    config
  };
}

export default connect(mapStateToProps)(WorkflowDetails);
