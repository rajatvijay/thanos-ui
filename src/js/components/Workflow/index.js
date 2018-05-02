import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon } from "antd";
import WorkflowList from "./workflow-list";
import { workflowActions } from "../../actions";
import FilterSidebar from "./filter";
import WorkflowFilterTop from "./filter-top";
import _ from "lodash";
import data from "../../data/data.js";

const { Content } = Layout;

const workflowListData = data;

const Workflows = ({ props }) => (
  <WorkflowList profile={props.match} listData={workflowListData} {...props} />
);

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = { sidebar: false, workflowId: null };
  }

  componentDidMount = () => {
    this.reloadWorkflowList();
  };

  reloadWorkflowList = () => {
    this.props.dispatch(workflowActions.getAll());
  };

  render() {
    return (
      <Layout className="workflow-container inner-container">
        <FilterSidebar />

        <Layout
          style={{ marginLeft: 250, background: "#FBFBFF", minHeight: "100vh" }}
        >
          {this.props.workflowFilters.kind ? <WorkflowFilterTop /> : null}

          {this.props.workflow.loading ? (
            <div className="text-center text-bold mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
            </div>
          ) : this.props.workflow.loadingStatus === "failed" ? (
            <div className="mr-top-lg text-center text-bold text-metal">
              Unable to load workflow list.{" "}
              <div className="text-anchor " onClick={this.reloadWorkflowList}>
                Click here to reload{" "}
                <i className="material-icons text-middle">refresh</i>
              </div>
            </div>
          ) : (
            <WorkflowList profile={this.props.match} {...this.props} />
          )}
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { workflowFilters, workflow, authentication } = state;
  return {
    workflow,
    workflowFilters,
    authentication
  };
}

export default connect(mapStateToProps)(Workflow);
