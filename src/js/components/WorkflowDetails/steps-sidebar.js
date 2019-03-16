import React, { Component } from "react";
import _ from "lodash";
import { Layout, Menu, Icon, Affix, Badge, Tooltip } from "antd";
import { calculatedData } from "../Workflow/calculated-data";
import { utils } from "../Workflow/utils";
import { history } from "../../_helpers";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const { getProcessedData } = calculatedData;
const { getVisibleSteps, isLockedStepEnable, isLockedStepGroupEnable } = utils;

const StepSidebar = props => {
  return (
    <Sider
      width={320}
      style={{
        overflow: "auto",
        height: "100%",
        position: "absolute",
        background: "#fcfdff"
      }}
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
  componentDidMount() {}

  onStepSelected(e) {
    //console.log(e)

    // let stepMeta = e.key.split("_");
    // let wid = this.props.step2[0].workflow;
    // let gid = stepMeta[0];
    // let sid = stepMeta[1];
    // history.push("/workflows/instances/" + wid+"/?group="+gid+"&step="+sid);
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
                {g.completed ? "check_circle" : "panorama_fish_eye"}
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
    let that = this;

    let steps = _.map(data, function(s, key) {
      let icon_cls = "panorama_fish_eye";
      if (s.completed_at) {
        icon_cls = "check_circle";
      } else if (s.is_locked) {
        icon_cls = "lock";
        // checking if all dependent_steps are visible, else return null
        if (!isLockedStepEnable(s, visible_steps)) {
          return null;
        }
      }

      //check alerts for steps
      let hasAlert = [];
      if (_.size(that.props.alerts)) {
        _.forEach(that.props.alerts, function(alert) {
          if (alert.step === s.id) {
            hasAlert.push({
              label: alert.alert.category.name,
              color: alert.alert.category.color_label
            });
          }
        });
      }

      return (
        <Menu.Item
          title={s.name}
          key={group_id + "_" + s.id}
          className={
            s.completed_at === null
              ? s.overdue ? "text-red overdue" : "text-light"
              : "text-secondary completed text-light"
          }
          style={{ paddingLeft: "40px" }}
        >
          <i className="material-icons t-14 pd-right-sm">{icon_cls}</i>
          {s.name}

          {_.size(hasAlert) ? (
            <span className="float-right pd-left">
              {_.map(hasAlert, alert => {
                return (
                  <Tooltip title={alert.label}>
                    <i
                      className="material-icons"
                      style={{ fontSize: "9px", color: alert.color }}
                    >
                      fiber_manual_records
                    </i>
                  </Tooltip>
                );
              })}
            </span>
          ) : null}
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
