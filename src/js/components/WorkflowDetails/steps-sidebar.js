import React, { Component } from "react";
import _ from "lodash";
import { Layout, Menu, Icon, Affix } from "antd";
import { calculatedData } from "../Workflow/calculated-data";
import { utils } from "../Workflow/utils";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { getProcessedData } = calculatedData;
const { getVisibleSteps, isLockedStepEnable, isLockedStepGroupEnable } = utils;

const StepSidebar = props => {
  console.clear();
  console.log("props........");
  console.log(props);
  return (
    <Sider
      width={250}
      style={{ overflow: "auto", height: "100%", position: "absolute" }}
      className="aux-nav aux-nav-menu aux-step-sidebar"
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
    let visible_steps = getVisibleSteps(data);

    return _.map(_.orderBy(data2, [{ id: Number }], ["asc"]), function(
      g,
      index
    ) {
      if (!_.size(g.steps)) {
        // checking for steps inside group
        return null;
      }

      if (!isLockedStepGroupEnable(g, visible_steps)) {
        return null;
      }
      return (
        <SubMenu
          title={g.definition.name}
          key={"sub-" + g.id}
          className={
            !g.completed
              ? g.overdue ? "text-red overdue" : "text-light "
              : "text-secondary completed text-medium"
          }
          title={
            <span>
              <i className="material-icons t-14 pd-right-sm">
                {g.completed ? "check_circle_outline" : g.definition.icon}
              </i>
              <span>{g.definition.name}</span>
            </span>
          }
        >
          {that.getSteps(g.steps, g.id, visible_steps)}
        </SubMenu>
      );
    });
  }

  getSteps(data, group_id, visible_steps) {
    let steps = _.map(data, function(s, key) {
      let icon_cls = "panorama_fish_eye";
      if (s.completed_at) {
        icon_cls = "check_circle_outline";
      } else if (s.is_locked) {
        icon_cls = "lock";
        // checking if all dependent_steps are visible, else return null
        if (!isLockedStepEnable(s, visible_steps)) {
          return null;
        }
      }
      return (
        <Menu.Item
          title={s.name}
          key={group_id + "_" + s.id}
          className={
            s.completed_at === null
              ? s.overdue ? "text-red overdue" : "text-light"
              : "text-secondary completed text-medium"
          }
        >
          <i className="material-icons t-14 pd-right-sm">{icon_cls}</i>
          {s.name}
        </Menu.Item>
      );
    });
    return steps;
  }

  render() {
    let grouping = this.props.step2;
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
          defaultSelectedKeys={[
            this.props.defaultOpenKeys + "_" + this.props.defaultSelectedKeys
          ]}
          defaultOpenKeys={["sub-" + this.props.defaultOpenKeys]}
          mode="inline"
        >
          {this.getGroups(grouping)}
        </Menu>
      </div>
    );
  }
}

export default StepSidebar;
