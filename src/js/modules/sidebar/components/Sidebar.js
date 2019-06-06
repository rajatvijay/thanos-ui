import React, { Component } from "react";
import { Layout, Icon, Select } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import { workflowFiltersActions, workflowKindActions } from "../../../actions";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import { css } from "emotion";
import _ from "lodash";

const { Sider } = Layout;
const Option = Select.Option;

class Sidebar extends Component {
  state = {
    activeFilter: [],
    parent: null,
    collapse: true
  };

  setFilter = () => {
    const payload = {
      filterType: "alert_category",
      filterValue: this.state.activeFilter
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentWillUpdate(nextProps) {
    if (
      nextProps.workflowKind.workflowKind !=
      this.props.workflowKind.workflowKind
    ) {
      let metaValue = _.find(nextProps.workflowKind.workflowKind, item => {
        return item.tag === "entity";
      });

      this.props.dispatch(workflowKindActions.setValue(metaValue));
    }
  }

  handleChange = value => {
    let id = parseInt(value, 10);

    let that = this;
    this.setState({ value });
    let metaValue = _.find(this.props.workflowKind.workflowKind, item => {
      return item.id === id;
    });
    let payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
    this.props.dispatch(workflowKindActions.setValue(metaValue));

    that.fetchGroupData(metaValue.tag);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
    this.props.dispatch(workflowKindActions.getStatusCount(tag));
  };

  renderDropdownList = () => {
    const { workflowKind } = this.props.workflowKind;
    if (workflowKind) {
      return workflowKind.map(function(item) {
        return <Option key={item.id}>{item.name}</Option>;
      });
    }
  };

  onSelectAlert = value => {
    if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.tag] }, function() {
        this.setFilter();
      });
    }
  };

  onSelectTask = value => {
    const payload = {
      filterType: "stepgroupdef",
      filterValue: value ? [value.id] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  render() {
    const { isError } = this.props.workflowAlertGroupCount;
    const { collapse } = this.state;
    const { workflowKind } = this.props.workflowKind;

    return (
      <Sider
        width={314}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#104774"
        }}
      >
        <div
          style={{
            width: 314,
            position: "fixed",
            paddingBottom: 100,
            height: "100%",
            fontFamily: "Cabin",
            minHeight: "110vh",
            background: "#104775"
          }}
        >
          <div className="logo" />
          <Select
            dropdownStyle={{ position: "fixed" }}
            className={css`
              .ant-select-selection {
                background-color: #0a3150;
                border: none;
                height: 65px;
                color: white;
                font-size: 18px;
              }
              .ant-select-selection-selected-value {
                line-height: 65px;
              }
              .ant-select-arrow {
                color: white;
              }
            `}
            defaultValue="Entity"
            style={{ width: "100%", display: "block" }}
            onChange={this.handleChange}
          >
            {this.renderDropdownList()}
          </Select>

          <div
            style={{
              backgroundColor: "#104774",
              padding: "5px 0px",
              // minHeight: "100vh"
              maxHeight: "80vh",
              overflowY: "scroll"
            }}
            className={css`
              .sidebarList:hover {
                opacity: 0.4;
              }
            `}
          >
            <div>
              <TaskQueueList
                taskQueues={this.props.workflowGroupCount.stepgroupdef_counts}
                loading={this.props.workflowAlertGroupCount.loading}
                // workflowGroupCount={this.props.workflowGroupCount}
                onSelectTask={this.onSelectTask}
              />
            </div>

            <div style={{ display: isError ? "none" : "block" }}>
              <AlertList
                alerts={this.props.workflowAlertGroupCount.alert_details}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectAlert={this.onSelectAlert}
              />
            </div>
          </div>
        </div>
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
