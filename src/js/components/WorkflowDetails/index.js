import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row, Col, Avatar, Progress, Tag, Popover } from "antd";
import StepSidebar from "./steps-sidebar";
import _ from "lodash";
import data from "../../data/data.js";
import dataSteps from "../../data/data-details.js";
//import realDataSteps from "../../data/realdata.js";
import StepBody from "./step-body.js";
import { baseUrl, authHeader } from "../../_helpers";
import { workflowDetailsActions, workflowActions } from "../../actions";
import { WorkflowHeader } from "../Workflow/workflow-item";

// const WorkflowHead=()=>{
//   return <div>

//   </div>
// }

const requestOptions = {
  method: "GET",
  headers: authHeader.get(),
  credentials: "include"
};

const fethcWorkflow = id => {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(baseUrl + "workflows/" + id + "/", requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong ...");
      }
    })
    .then(data => this.setState({ data, isLoading: false }))
    .catch(error => this.setState({ error, isLoading: false }));
};

class WorkflowDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      workflowId: null,
      selectedStep: null,
      selectedGroup: null
    };
  }

  componentWillReceiveProps = nextProps => {
    //if (newProps) this.getUser(newProps);

    if (nextProps.workflowDetails.loading === false) {
      let wfd = nextProps.workflowDetails.workflowDetails;
      let wf_id = parseInt(this.props.match.params.id, 10);
      let stepGroup_id = wfd.stepGroups.results[0].id;
      let step_id = wfd.stepGroups.results[0].steps[0].id;

      let stepTrack = {
        workflowId: wf_id,
        groupId: stepGroup_id,
        stepId: step_id
      };

      this.setState(
        {
          selectedGroup: stepGroup_id,
          selectedStep: step_id
        },

        function() {
          this.props.dispatch(workflowDetailsActions.getStepFields(stepTrack));
        }
      );
    }
  };

  componentDidMount = () => {
    var that = this;
    var id = parseInt(that.props.match.params.id, 10);
    var wfData = _.find(data, function(o) {
      return o.id === id;
    });

    //this.getUser(this.props);

    this.props.dispatch(workflowDetailsActions.getStepGroup(id));

    //getworkflow data
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
    // if(!id){
    // }
    return this.props.dispatch(workflowActions.getById(id));
  };

  render() {
    let workflowDetails = this.props.workflowDetails.workflowDetails;
    let stepLoading = this.props.workflowDetails.loading;
    //let workflowData2 = this.getHeaderData();
    // console.log('workflowData2');
    // console.log(workflowData2);
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
          {this.state.loading || !this.state.wfdata ? (
            <div className="text-center">
              <Icon type="loading" />
            </div>
          ) : (
            <div>
              <WorkflowHeader workflow={this.state.wfdata} />
            </div>
          )}
        </div>

        <StepSidebar
          step2={
            this.props.workflowDetails.workflowDetails
              ? this.props.workflowDetails.workflowDetails.stepGroups.results
              : null
          }
          step={dataSteps}
          defaultSelectedGroup={this.state.selectedStep}
          defaultSelectedStep={["1"]}
          onStepSelected={this.onStepSelected.bind(this)}
          loading={stepLoading}
        />

        <Layout
          style={{ marginLeft: 250, background: "#FBFBFF", height: "100vh" }}
        >
          <div className="mr-ard-md  shadow-1 bg-white">
            <StepBody
            // stepBody={
            //   this.state.selectedStep
            //     ? this.state.selectedStep
            //     : dataSteps.steps[0]
            // }
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
