import React, { Component } from "react";
import { Layout } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import { connect } from "react-redux";
import { css } from "emotion";
import { getAllTaskQueuesThunk } from "../../thunks";
import { injectIntl } from "react-intl";
import KindDropdown from "./KindDropdown";
import { taskQueuesSelector, alertsSelector } from "../../selectors";
import { FILTERS_ENUM } from "../../constants";
import withFilters from "../../filters";

const { Sider } = Layout;

class Sidebar extends Component {
  toggleFilter = field => value => {
    if (field === FILTERS_ENUM.TASK_QUEUE_FILTER) {
      console.log("TASK_QUEUE_FILTER", this.selectedTaskQueues);
      if (
        this.selectedTaskQueues &&
        this.selectedTaskQueues.tag === value.tag
      ) {
        // Remove case
        this.props.removeFilters([FILTERS_ENUM.TASK_QUEUE_FILTER.name]);
      } else {
        // Apply case
        this.props.addFilters([
          {
            name: FILTERS_ENUM.TASK_QUEUE_FILTER.name,
            key: FILTERS_ENUM.TASK_QUEUE_FILTER.key,
            value: value.tag,
            meta: value
          }
        ]);
      }
    }

    if (field === FILTERS_ENUM.ALERT_FILTER) {
      if (this.selectedAlert && this.selectedAlert.id === value.id) {
        // Remove case
        this.props.removeFilters([FILTERS_ENUM.ALERT_FILTER.name]);
      } else {
        // Apply case
        this.props.addFilters([
          {
            name: FILTERS_ENUM.ALERT_FILTER.name,
            key: FILTERS_ENUM.ALERT_FILTER.key,
            value: value.id,
            meta: value
          }
        ]);
      }
    }

    if (field === FILTERS_ENUM.MY_TASK_FILTER) {
      if (this.isMyTaskSelected) {
        // Remove case
        this.props.removeFilters([FILTERS_ENUM.MY_TASK_FILTER.name]);
      } else {
        // Apply case
        this.props.addFilters([
          {
            name: FILTERS_ENUM.MY_TASK_FILTER.name,
            key: FILTERS_ENUM.MY_TASK_FILTER.key,
            value: "Assignee",
            meta: "Assignee"
          }
        ]);
      }
    }
  };

  get selectedTaskQueues() {
    return this.props.getSelectedFilterValue(
      FILTERS_ENUM.TASK_QUEUE_FILTER.name
    );
  }

  get selectedAlert() {
    return this.props.getSelectedFilterValue(FILTERS_ENUM.ALERT_FILTER.name);
  }

  get isMyTaskSelected() {
    return !!this.props.getSelectedFilterValue(
      FILTERS_ENUM.MY_TASK_FILTER.name
    );
  }

  render() {
    const { taskQueues, alerts } = this.props;

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
          className={css`
            width: 300px;
            padding-bottom: 100px;
            height: 100%;
            font-family: Cabin;
            min-height: 110vh;
            background: #104775;
            position: fixed;
          `}
        >
          <KindDropdown />
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
            <TaskQueueList
              activeTaskQueue={this.selectedTaskQueues}
              taskQueues={taskQueues.data}
              loading={taskQueues.isLoading}
              onClick={this.toggleFilter(FILTERS_ENUM.TASK_QUEUE_FILTER)}
              onClickMyTask={this.toggleFilter(FILTERS_ENUM.MY_TASK_FILTER)}
              isMyTaskSelected={this.isMyTaskSelected}
            />

            <AlertList
              alerts={alerts.data}
              loading={alerts.isLoading}
              onClick={this.toggleFilter(FILTERS_ENUM.ALERT_FILTER)}
              selectedAlert={this.selectedAlert}
            />
          </div>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return {
    taskQueues: taskQueuesSelector(state),
    alerts: alertsSelector(state)
  };
}

export default connect(
  mapStateToProps,
  { getAllTaskQueuesThunk }
)(injectIntl(withFilters(Sidebar)));
