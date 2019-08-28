import React, { Component } from "react";
import { Layout, Select } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import {
  workflowFiltersActions,
  workflowKindActions
} from "../../../js/actions";
import { connect } from "react-redux";
import { css } from "emotion";
import _ from "lodash";
import { taskQueueCount } from "../sidebarActions";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../js/_helpers/intl-helpers";

const { Sider } = Layout;
const Option = Select.Option;

class Sidebar extends Component {
  state = {
    activeFilter: [],
    parent: null,
    collapse: true
  };

  componentDidMount() {
    this.props.taskQueueCount();
  }

  setFilter = () => {
    const payload = {
      filterType: "alert_category",
      filterValue: this.state.activeFilter
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentDidUpdate(prevProps) {
    const { workflowKind, selectedKindValue } = this.props;
    const { workflowKind: prevWorkflowKind } = prevProps;

    if (workflowKind.workflowKind && !prevWorkflowKind.workflowKind) {
      // So, we just got workflow kinds populated.
      // Now, we'll check if there's no selected workflow kind
      // Or if the one selected is not available anymore,
      // in which case, we'll assign a default one.
      if (
        !selectedKindValue ||
        !workflowKind.workflowKind.find(
          workflow => workflow.id === selectedKindValue.id
        )
      ) {
        this.props.dispatch(
          workflowKindActions.setValue(workflowKind.workflowKind[0])
        );
      }
    }
  }

  handleChange = value => {
    const id = parseInt(value, 10);
    const that = this;
    const metaValue = _.find(this.props.workflowKind.workflowKind, item => {
      return item.id === id;
    });

    this.setState({ value: id });
    const payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    const removePayload = { filterType: "stepgroupdef" };
    this.props.dispatch(workflowFiltersActions.removeFilters(removePayload));
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
    this.props.dispatch(workflowKindActions.setValue(metaValue));
    that.fetchGroupData(metaValue.tag);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
  };

  renderDropdownList = () => {
    const { workflowKind } = this.props.workflowKind;
    if (workflowKind) {
      return workflowKind.map(function(item) {
        return <Option key={`${item.id}`}>{getIntlBody(item, "name")}</Option>;
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
      filterValue: value ? [value.tag] : []
    };
    if (!!value)
      this.props.dispatch(workflowFiltersActions.setFilters(payload));
    else this.props.dispatch(workflowFiltersActions.removeFilters(payload));
  };

  onSelectMyTask = tag => {
    const payload = {
      filterType: "user-step-tag",
      filterValue: tag ? [tag] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  get isMyTaskSelected() {
    return (
      this.props.workflowFilters["user-step-tag"] &&
      this.props.workflowFilters["user-step-tag"].filterValue &&
      this.props.workflowFilters["user-step-tag"].filterValue.length &&
      this.props.workflowFilters["user-step-tag"].filterValue.includes(
        "Assignee"
      )
    );
  }

  render() {
    const { isError } = this.props.workflowAlertGroupCount;
    const { selectedKindValue } = this.props;
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
        <div
          style={{
            width: 300,
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
                padding-left: 10px;
              }
              .ant-select-selection-selected-value {
                line-height: 65px;
              }
              .ant-select-arrow {
                color: white;
                margin-right: 10px;
              }
            `}
            dropdownClassName="kind-select"
            value={selectedKindValue && selectedKindValue.name}
            style={{ width: "100%", display: "block" }}
            onChange={this.handleChange}
          >
            {this.renderDropdownList()}
          </Select>

          <div
            style={{
              backgroundColor: "#104774",
              padding: "5px 0px",
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
                count={this.props.count}
                activeTaskQueue={this.props.workflowFilters}
                taskQueues={this.props.workflowGroupCount.stepgroupdef_counts}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectTask={this.onSelectTask}
                onSelectMyTask={this.onSelectMyTask}
                isMyTaskSelected={this.isMyTaskSelected}
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
    workflowKindValue,
    config,
    languageSelector,
    showFilterMenu,
    taskQueueCount
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    selectedKindValue: workflowKindValue.selectedKindValue,
    config,
    languageSelector,
    showFilterMenu,
    count: taskQueueCount.count
  };
}

export default connect(
  mapStateToProps,
  { taskQueueCount }
)(injectIntl(Sidebar));
