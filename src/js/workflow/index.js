import React, { Component } from "react";
import { Layout } from "antd";
import WorkflowList from "./workflow-list";
//import Profile from "./profile";
import WorkflowFilter from "./filter";
import _ from "lodash";
import data from "./data.js";

const { Sider, Content } = Layout;

const workflowListData = data;

const Workflows = ({ match }) => (
  <WorkflowList profile={match} listData={workflowListData} />
);

class Workflow extends Component {
  constructor(props) {
    super();
    this.state = { sidebar: false, workflowId: null };
  }

  componentWillReceiveProps = newProps => {
    //if (newProps) this.getUser(newProps);
  };

  componentDidMount = () => {
    //this.getUser(this.props);
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
        <Layout style={{ marginLeft: 250, background: "#FBFBFF" }}>
          <Workflows />
        </Layout>
      </Layout>
    );
  }
}

export default Workflow;
