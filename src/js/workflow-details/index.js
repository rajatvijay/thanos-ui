import React, { Component } from "react";
import { Layout } from "antd";
import WorkflowList from "./workflow-list";
//import Profile from "./profile";
import WorkflowFilter from "./filter";
import _ from "lodash";
import data from "./data.js";

const { Sider, Content } = Layout;

const workflowListData = data;

class WorkflowDetails extends Component {
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
        <div className="text-center">
          <br />
          ...
          <br />
          ...
          <br />
          ...sdklfjsldkfj
          <br />
          ...sdfasdfasdf
          <br />
          ...asdffasdfasdff
          <br />
          ...dfbfdhgj
          <br />
          ...twyerywryt
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
        </div>
      </Layout>
    );
  }
}

export default WorkflowDetails;
