import React, { Component } from "react";
import _ from "lodash";
import { Layout, Menu, Icon } from "antd";
import { calculatedDate } from "../Workflow/calculated-data";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { getProcessedData } = calculatedDate;

const StepSidebar = props => {
  return (
    <Sider
      width={250}
      style={{ overflow: "auto", height: "100%", position: "absolute" }}
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

    return _.map(_.orderBy(data2, [{ id: Number }], ["asc"]), function(
      g,
      index
    ) {
      if(!_.size(g.steps)) {  // checking for steps inside group
        return null;
      }
      return (
        <SubMenu
          key={"sub-" + g.id}
          className={
            !g.completed
              ? g.overdue ? "text-red overdue" : "text-metal "
              : "text-primary completed"
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
          {that.getSteps(g.steps, g.id)}
        </SubMenu>
      );
    });
  }

  getSteps(data, group_id) {
    let steps = _.map(data, function(s, key) {
      // console.log('--------------------------------------------------f')
      // console.log(s)
      let icon_cls = 'panorama_fish_eye';
      if(s.completed_at) {
        icon_cls = 'check_circle';
      } else if(s.is_locked) {
        icon_cls = 'lock'
      }
      return (
        <Menu.Item
          key={group_id + "_" + s.id}
          className={
            s.completed_at === null
              ? s.overdue ? "text-red overdue" : "text-metal"
              : "text-primary completed"
          }
        >
          <i className="material-icons t-14 pd-right-sm">
            {icon_cls}
          </i>
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
