import React, { Component } from "react";
import { Layout } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import { connect } from "react-redux";
import { css } from "emotion";
import { getAllTaskQueuesThunk, applyWorkflowFilterThunk } from "../../thunks";
import { injectIntl } from "react-intl";
import KindDropdown from "./KindDropdown";
import {
  taskQueuesSelector,
  alertsSelector,
  selectedAlertsSelector,
  selectedTaskQueuesSelector,
  isMyTaskSelectedSelector
} from "../../selectors";
import {
  TASK_QUEUE_FILTER_NAME,
  MY_TASK_FILTER_NAME,
  ALERTS_FILTER_NAME
} from "../../constants";

const { Sider } = Layout;

class Sidebar extends Component {
  toggleFilter = field => value => {
    if (field === TASK_QUEUE_FILTER_NAME) {
      const { selectedTaskQueues } = this.props;
      if (selectedTaskQueues && selectedTaskQueues.tag === value.tag) {
        // Remove case
        this.props.applyWorkflowFilterThunk({ field, value: null });
      } else {
        // Apply case
        this.props.applyWorkflowFilterThunk({ field, value });
      }
    }

    if (field === ALERTS_FILTER_NAME) {
      const { selectedAlerts } = this.props;
      if (selectedAlerts && selectedAlerts.id === value.id) {
        // Remove case
        this.props.applyWorkflowFilterThunk({ field, value: null });
      } else {
        // Apply case
        this.props.applyWorkflowFilterThunk({ field, value });
      }
    }

    if (field === MY_TASK_FILTER_NAME) {
      const { isMyTaskSelected } = this.props;
      if (isMyTaskSelected) {
        // Remove case
        this.props.applyWorkflowFilterThunk({ field, value: null });
      } else {
        // Apply case
        this.props.applyWorkflowFilterThunk({
          field,
          value: { value: "Assignee" }
        });
      }
    }
  };

  render() {
    const {
      taskQueues,
      alerts,
      selectedTaskQueues,
      isMyTaskSelected
    } = this.props;

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
              activeTaskQueue={selectedTaskQueues}
              taskQueues={taskQueues.data}
              loading={taskQueues.isLoading}
              onClick={this.toggleFilter(TASK_QUEUE_FILTER_NAME)}
              onClickMyTask={this.toggleFilter(MY_TASK_FILTER_NAME)}
              isMyTaskSelected={isMyTaskSelected}
            />

            <AlertList
              alerts={alerts.data}
              loading={alerts.isLoading}
              onClick={this.toggleFilter(ALERTS_FILTER_NAME)}
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
    alerts: alertsSelector(state),
    selectedAlerts: selectedAlertsSelector(state),
    selectedTaskQueues: selectedTaskQueuesSelector(state),
    isMyTaskSelected: isMyTaskSelectedSelector(state)
  };
}

export default connect(
  mapStateToProps,
  { getAllTaskQueuesThunk, applyWorkflowFilterThunk }
)(injectIntl(Sidebar));
