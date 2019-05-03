import React, { Component } from "react";

import {
  Layout,
  Menu,
  Icon,
  Divider,
  Badge,
  Tag,
  Tooltip,
  Typography,
  Collapse
} from "antd";
//import { Icon, Divider, Badge, Tag, Tooltip } from "antd";
import _ from "lodash";
import TaskQueue from "./TaskQueue";
import Alerts from "./Alerts";

import {
  workflowFiltersActions,
  workflowActions,
  workflowKindActions,
  createWorkflow
} from "../../../../actions";
import { connect } from "react-redux";

const { Header, Content, Footer, Sider } = Layout;

const { Title, Text } = Typography;
const Panel = Collapse.Panel;

class Sidebar extends Component {
  componentDidMount = () => {
    if (!this.props.workflowKind.workflowKind) {
      this.loadWorkflowKind();
    }
  };

  loadWorkflowKind = () => {
    this.props.dispatch(workflowKindActions.getAll());
    this.props.dispatch(workflowActions.getAll());
    this.props.dispatch(workflowKindActions.getAlertCount("entity"));
  };

  onSelectTask = value => {
    console.log(value);
    let payload = {
      filterType: "stepgroupdef",
      filterValue: [value.id]
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };
  componentWillReceiveProps = nextProps => {
    if (this.props.workflowFilters !== nextProps.workflowFilters) {
      this.props.dispatch(workflowActions.getAll());
    }
  };

  render() {
    let that = this;
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;
    const { alert_details } = this.props.workflowAlertGroupCount;

    console.log(this.onSelectTask);
    return (
      <Sider
        width={300}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#104774"
        }}
      >
        <div className="logo" />
        <Collapse defaultActiveKey={["1"]}>
          <Panel style={{ padding: 0 }} header="TPI" key="1">
            <Menu
              style={{ backgroundColor: "#104774", padding: "20px 0px" }}
              mode="inline"
            >
              <TaskQueue
                workflowGroupCount={this.props.workflowGroupCount}
                onSelectTask={this.onSelectTask}
              />

              <Alerts
                workflowAlertGroupCount={this.props.workflowAlertGroupCount}
                onSelectTask={this.onSelectTask}
              />
            </Menu>
          </Panel>
        </Collapse>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(Sidebar);
