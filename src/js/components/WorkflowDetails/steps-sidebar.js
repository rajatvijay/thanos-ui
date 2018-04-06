import React, { Component } from "react";
//import { Select, Spin } from "antd";
import _ from "lodash";
import moment from "moment";
import { Layout, Menu, Icon } from "antd";
//import Utils from "../../utils/utils";
//import Config from "../../utils/config";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

// const getMenuList = (data)=> (
//   var list =
// )

// const getGroups = (data)=> (

// )

// const getSteps = (data)=> (
//   //var list = data;
// )

class StepSidebar extends Component {
  // constructor(props) {
  //   super(props);
  //   //const state = {}
  // }

  componentDidMount() {}

  onStepSelected(e) {
    this.props.onStepSelected(e);
  }

  getGroups(data) {
    var that = this;
    return _.map(data, function(g, key) {
      return (
        <SubMenu
          key={"sub-" + key}
          style={{ backgroundColor: "transparent" }}
          className="kkllk"
          title={
            <span>
              <Icon type="mail" />
              <span>{key}</span>
            </span>
          }
        >
          {that.getSteps(g)}
        </SubMenu>
      );
    });
  }

  getSteps(data) {
    var steps = _.map(data, function(s, key) {
      return <Menu.Item key={s.id}>{s.label}</Menu.Item>;
    });
    return steps;
  }

  render() {
    var grouping = _.groupBy(this.props.step.steps, "group.label");
    //var groups = _.map(this.props.step.steps, "group");

    if (this.props.step.deadline) {
      var isOverdue = moment(this.props.step.deadline).isBefore(new Date());
    }

    return (
      <Sider
        width={250}
        style={{ overflow: "auto", height: "100vh", position: "absolute" }}
        className="aux-nav aux-nav-menu bg-primary-light"
      >
        <Menu
          onClick={this.onStepSelected.bind(this)}
          style={{
            width: "100%",
            height: "vh100",
            overflowX: "hidden",
            background: "transparent"
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          {this.getGroups(grouping)}
        </Menu>
      </Sider>
    );
  }
}

export default StepSidebar;
