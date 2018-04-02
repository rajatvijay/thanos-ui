import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon } from "antd";
import WorkflowList from "./workflow-list";
//import Profile from "./profile";
import { workflowActions } from "../../actions";
import WorkflowFilter from "./filter";
import _ from "lodash";
import data from "../../data/data.js";

const { Sider, Content } = Layout;

const workflowListData = data;

const Workflows = ({ props }) => (
  <WorkflowList profile={props.match} listData={workflowListData} {...props} />
);

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = { sidebar: false, workflowId: null };
  }

  componentWillReceiveProps = newProps => {
    //if (newProps) this.getUser(newProps);
  };

  componentDidMount = () => {
    //this.getUser(this.props);
    this.props.dispatch(workflowActions.getAll());
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
          style={{ marginLeft: 250, background: "#FBFBFF", height: "100vh" }}
        >
          {this.props.workflow.loading ? (
            <div className="text-center text-bold mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
            </div>
          ) : (
            <Workflows props={this.props} />
          )}
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { workflow } = state;
  return {
    workflow
  };
}

export default connect(mapStateToProps)(Workflow);
