import React, { Component } from "react";
//import { Select, Spin } from "antd";
import _ from "lodash";
import moment from "moment";
import { Layout, Menu, Icon } from "antd";
//import Utils from "../../utils/utils";
//import Config from "../../utils/config";
import { calculatedDate } from "../Workflow/calculated-data";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { getProcessedData, getProgressData } = calculatedDate;

// const getMenuList = (data)=> (
//   var list =
// )

// const getGroups = (data)=> (

// )

// const getSteps = (data)=> (
//   //var list = data;
// )

const StepSidebar = props => {
  return (
    <Sider
      width={250}
      style={{ overflow: "auto", height: "100vh", position: "absolute" }}
      className="aux-nav aux-nav-menu bg-primary-light"
    >
      {props.loading || props.step2 === null ? (
        <div className="text-center" style={{ fontSize: 24 }}>
          <Icon type="loading" />
        </div>
      ) : (
        <StepSidebarMenu {...props} />
      )}
    </Sider>
  );
};

class StepSidebarMenu extends Component {
  // constructor(props) {
  //   super(props);
  //   //const state = {}
  // }

  componentDidMount() {}

  onStepSelected(e) {
    this.props.onStepSelected(e);
  }

  getGroups(data) {
    let that = this;
    let data2 = getProcessedData(data);

    return _.map(data2, function(g, index) {
      return (
        <SubMenu
          key={"sub-" + g.id}
          className={!g.completed ? "text-primary " : "text-green completed"}
          title={
            <span>
              <i className="material-icons t-14 pd-right-sm">
                {g.completed ? "check_circle_outline" : g.definition.icon}
              </i>
              <span>{g.definition.name}</span>
            </span>
          }
        >
          {that.getSteps(g.steps, g.id)}
        </SubMenu>
      );
    });
  }

  getSteps(data, group_id) {
    let steps = _.map(data, function(s, key) {
      return (
        <Menu.Item
          key={group_id + "_" + s.id}
          className={s.completed_at === null ? "text-metal" : "text-green"}
        >
          <i className="material-icons t-14 pd-right-sm">
            {s.completed_at === null ? "panorama_fish_eye" : "check_circle"}
          </i>
          {s.name}
        </Menu.Item>
      );
    });
    return steps;
  }

  render() {
    let grouping = this.props.step2;

    // console.log('this.props StepSidebar--------')
    // console.log(this.props)

    return (
      <div>
        <Menu
          onClick={this.onStepSelected.bind(this)}
          style={{
            width: "100%",
            height: "vh100",
            overflowX: "hidden",
            background: "transparent"
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub-" + this.props.defaultSelectedGroup]}
          mode="inline"
        >
          {this.getGroups(grouping)}
        </Menu>
      </div>
    );
  }
}

export default StepSidebar;
