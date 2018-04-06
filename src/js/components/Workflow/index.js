import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon } from "antd";
import WorkflowList from "./workflow-list";
import { workflowActions } from "../../actions";
import WorkflowFilter from "./filter";

const { Sider } = Layout;

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
        <Sider
          width={250}
          style={{ overflow: "auto", height: "100vh", position: "fixed" }}
          className="aux-nav aux-nav-filter bg-primary-light"
        >
          <h5 className="aux-item aux-lead">Filters</h5>
          <div className="aux-item aux-lead">
            <WorkflowFilter placeholder="skill" />
          </div>
          <div className="aux-item aux-lead">
            <WorkflowFilter placeholder="Name" />
          </div>
          <div className="aux-item aux-lead">
            <WorkflowFilter placeholder="Supplier company" />
          </div>
          <div className="aux-item aux-lead">
            <WorkflowFilter placeholder="Country" />
          </div>
          <div className="aux-item aux-lead">
            <WorkflowFilter placeholder="Group" />
          </div>
        </Sider>
        <Layout
          style={{ marginLeft: 250, background: "#FBFBFF", minHeight: "100vh" }}
        >
          {this.props.workflow.loading ? (
            <div className="text-center text-bold mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
            </div>
          ) : this.props.workflow.loadingStatus === "failed" ? (
            <div className="mr-top-lg text-center text-bold text-metal">
              Unable to load workflow list.{" "}
              <span
                className="text-thin text-primary text-underline text-anchor small"
                onClick={this.reloadWorkflowList}
              >
                Click here to reload{" "}
              </span>
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
  const { workflow, authentication } = state;
  return {
    workflow,
    authentication
  };
}

export default connect(mapStateToProps)(Workflow);
