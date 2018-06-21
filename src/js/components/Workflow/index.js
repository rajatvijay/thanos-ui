import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon } from "antd";
import WorkflowList from "./workflow-list";
import { workflowActions } from "../../actions";
import FilterSidebar from "./filter";
import WorkflowFilterTop from "./filter-top";

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

  // callBackCollapser = () => {
  //   this.setState({ sidebar: !this.state.sidebar });
  // };

  render = () => {
    return (
      <Layout className="workflow-container inner-container">
        <FilterSidebar />

        <Layout style={{ marginLeft: 250, minHeight: "100vh" }}>
          {this.props.workflowFilters.kind.filterValue !== null ? (
            <WorkflowFilterTop {...this.props} />
          ) : null}

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
            <div className="clearfix">
              {/*<div className="filter-section mr-top-lg mr-left-lg clearfix">
                <Button
                  type={this.state.sidebar ? "primary" : "default"}
                  className="constom button anchor"
                  onClick={this.callBackCollapser}
                >
                  Custom filter
                </Button>
              </div>*/}

              <WorkflowList profile={this.props.match} {...this.props} />
              {/*<Filter2
                sidebar={this.state.sidebar}
                toggleSidebar={this.callBackCollapser}
              />
              */}
            </div>
          )}
        </Layout>
      </Layout>
    );
  };
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
