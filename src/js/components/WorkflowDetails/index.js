import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row, Col, Avatar, Progress, Tag, Popover } from "antd";
import StepSidebar from "./steps-sidebar";
import _ from "lodash";
import data from "../../data/data.js";
import dataSteps from "../../data/data-details.js";
import StepBody from "./step-body.js";
import { workflowDetailsActions, workflowActions } from "../../actions";
import { WorkflowHeader2 } from "../Workflow/workflow-item";

class Header extends Component {
  // constructor(props) {
  //   super(props);
  //   //const state = {}
  // }

  componentDidMount() {}

  getHeaderGroup() {
    //Calculate workflow progress
    var pendingSteps = _.size(
      _.filter(this.props.workflowData.steps, function(s) {
        return (s.status || {}).completed_at === null || undefined;
      })
    );
    var totalSteps = _.size(this.props.workflowData.steps);
    var completedSteps = totalSteps - pendingSteps;
    var progressPercent = completedSteps / totalSteps * 100;

    return (
      <div>
        <div>
          <Progress showInfo={false} percent={progressPercent} />
          {/*<Progress percent={(that.state.completedSteps/that.state.totalSteps) *100} successPercent={(that.state.waitingTask/that.state.totalSteps) *100} />*/}
        </div>
      </div>
    );
  }

  render() {
    const workflowData = this.props.workflowData;
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );

    if (workflowData) {
      return (
        <Row type="flex" align="middle" className="lc-card-head">
          <Col span={1} className="text-center text-metal ">
            <Icon type="copy" />
          </Col>
          <Col span={7}>
            <Avatar>J</Avatar>{" "}
            <span className="mr-left-sm text-grey-dark text-medium">
              {workflowData.name}
            </span>
          </Col>
          <Col span={10}>{this.getHeaderGroup()}</Col>
          <Col span={4} className="text-right">
            <Tag color="orange">{workflowData.status.label}</Tag>{" "}
          </Col>
          <Col
            span={2}
            className="text-center "
            style={{ position: "relative" }}
          >
            <Popover
              placement="bottomRight"
              content={content}
              title="Title"
              trigger="hover"
            >
              <Icon
                type="solution"
                style={{
                  position: "absolute",
                  fontSize: "18px",
                  right: "48px",
                  top: "-8px"
                }}
                className=" text-primary"
              />
            </Popover>

            <Popover
              placement="bottomRight"
              content={content}
              title="Title"
              trigger="hover"
            >
              <i
                style={{
                  position: "absolute",
                  fontSize: "18px",
                  right: "16px",
                  top: "-8px"
                }}
                className=" text-primary material-icons md-24"
              >
                more_vert
              </i>
            </Popover>
          </Col>
        </Row>
      );
    } else {
      return <div>...</div>;
    }
  }
}

// const WorkflowHead=()=>{
//   return <div>

//   </div>
// }

class WorkflowDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { sidebar: false, workflowId: null, selectedStep: null };
  }

  componentWillReceiveProps = newProps => {
    //if (newProps) this.getUser(newProps);
  };

  componentDidMount = () => {
    var that = this;
    var id = parseInt(that.props.match.params.id, 10);
    var wfData = _.find(data, function(o) {
      return o.id === id;
    });

    this.setState({ workflowData: wfData });
    //this.getUser(this.props);

    this.props.dispatch(workflowDetailsActions.getStepGroup(id));
    console.log(this.getHeaderData(id));
  };

  callBackCollapser = () => {
    this.setState({ sidebar: !this.state.sidebar });
  };

  // getUser(props) {
  //   if (props.profile.params.id !== undefined) {
  //     const uid = parseInt(props.profile.params.id);
  //     var user = _.find(usersList, { id: uid });
  //     this.setState({ sidebar: false, userId: uid, user: user }, function() {
  //       console.log(this.state);
  //     });
  //   }
  // }

  onStepSelected = cb => {
    var steps = dataSteps.steps;
    var selected = _.find(steps, { id: parseInt(cb.key, 10) });
    this.setState({ selectedStep: selected });
  };

  getHeaderData = id => {
    return this.props.dispatch(workflowActions.getById(id));
  };

  render() {
    let workflowData = this.state.workflowData;
    let workflowDetails = this.props.workflowDetails.workflowDetails;
    let stepLoading = this.props.workflowDetails.loading;
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
          {/*<WorkflowHeader2 workflow={this.getHeaderData} />*/}

          {workflowData ? <Header workflowData={workflowData} /> : null}
        </div>

        <StepSidebar
          step2={
            this.props.workflowDetails.workflowDetails
              ? this.props.workflowDetails.workflowDetails.stepGroups.results
              : null
          }
          step={dataSteps}
          onStepSelected={this.onStepSelected.bind(this)}
          loading={stepLoading}
        />

        <Layout
          style={{ marginLeft: 250, background: "#FBFBFF", height: "100vh" }}
        >
          <div className="mr-ard-md  shadow-1 bg-white">
            <StepBody
              stepBody={
                this.state.selectedStep
                  ? this.state.selectedStep
                  : dataSteps.steps[0]
              }
            />
          </div>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { workflowDetails } = state;
  return {
    workflowDetails
  };
}

export default connect(mapStateToProps)(WorkflowDetails);
