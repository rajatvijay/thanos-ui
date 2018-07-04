import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Tooltip } from "antd";
import StepSidebar from "./steps-sidebar";
import _ from "lodash";
import StepBody from "./step-body.js";
import { baseUrl, authHeader } from "../../_helpers";
import {
  workflowDetailsActions,
  workflowActions,
  workflowFiltersActions,
  workflowStepActions
} from "../../actions";
import { WorkflowHeader } from "../Workflow/workflow-item";
import Comments from "./comments";

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
      selectedGroup: null
    };
    let params = props.location.search;
    let qs = this.queryStringToObject(params);
    if (qs.object_id && qs.type) {
      props.dispatch(workflowDetailsActions.getComment(qs.object_id, qs.type));
    }
  }

  currentActiveStep = wfd => {
    let activeStepGroup = null;
    let activeStep = null;
    _.forEach(wfd.stepGroups.results, function(step_group) {
      if (step_group.is_complete) {
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
    if (!activeStepGroup) {
      activeStepGroup = wfd.stepGroups.results[0];
      activeStep = wfd.stepGroups.results[0].steps[0];
    }
    return {
      activeStepGroup: activeStepGroup,
      activeStep: activeStep
    };
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.workflowDetails.loading === false) {
      let wfd = nextProps.workflowDetails.workflowDetails;
      let wf_id = parseInt(this.props.match.params.id, 10);
      let active_step_data = this.currentActiveStep(wfd);
      let stepGroup_id = active_step_data["activeStepGroup"].id;
      let step_id = active_step_data["activeStep"].id;

      let stepTrack = {
        workflowId: wf_id,
        groupId: stepGroup_id,
        stepId: step_id
      };

      //Get target step and group data from url.
      let params = this.props.location.search;
      let qs = this.queryStringToObject(params);

      if (!_.isEmpty(qs)) {
        this.setState({ selectedStep: qs.step, selectedGroup: qs.group });
        stepTrack = {
          workflowId: wf_id,
          groupId: qs.group,
          stepId: qs.step
        };
      } else {
        this.setState({ selectedStep: step_id, selectedGroup: stepGroup_id });
      }
      if (!this.state.loading_sidebar) {
        this.props.dispatch(workflowDetailsActions.getStepFields(stepTrack));
      }
    }
  };

  componentDidMount = () => {
    var that = this;
    var id = parseInt(that.props.match.params.id, 10);

    this.props.dispatch(workflowDetailsActions.getStepGroup(id));

    //Get workflow  basic data
    fetch(baseUrl + "workflows/" + id + "/", requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(wfdata => this.setState({ wfdata, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
    this.props.dispatch(workflowFiltersActions.getStatusData());
    window.scrollTo(0, 0);
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

  getHeaderData = () => {
    let id = parseInt(this.props.match.params.id, 10);
    return this.props.dispatch(workflowActions.getById(id));
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

  render() {
    let stepLoading = this.props.workflowDetails.loading;
    let comment_data = this.props.workflowComments.data;
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
          {stepLoading || !this.state.wfdata ? (
            <div className="text-center">
              <Icon type="loading" />
            </div>
          ) : (
            <div>
              <WorkflowHeader
                detailsPage={true}
                kind={this.props.workflowKind}
                workflow={this.state.wfdata}
                statusType={this.props.workflowFilterType.statusType}
                showCommentIcon={true}
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
            paddingTop: "23px"
          }}
        >
          <div className="mr-ard-md  shadow-1 bg-white">
            <StepBody toggleSidebar={this.callBackCollapser} />
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
            {...this.props}
          />
        ) : null}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowDetails,
    workflowFilterType,
    workflowKind,
    workflowComments
  } = state;
  return {
    workflowDetails,
    workflowFilterType,
    workflowKind,
    workflowComments
  };
}

export default connect(mapStateToProps)(WorkflowDetails);
