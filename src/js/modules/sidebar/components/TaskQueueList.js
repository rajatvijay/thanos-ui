import React, { Component } from "react";
import { Icon, Spin } from "antd";
import styled from "@emotion/styled";
import { css } from "emotion";
import TaskQueue from "./TaskQueue";

const INITIAL_SHOW_COUNT = 5;

class TaskQueueList extends Component {
  state = { selected: null, showingAll: false };

  onSelect = taskQueue => {
    const { onSelectTask } = this.props;
    const { selected } = this.state;

    if (selected === taskQueue.name) {
      this.setState({ selected: null });
      onSelectTask();
    } else {
      this.setState({ selected: taskQueue.name });
      onSelectTask(taskQueue);
    }
  };

  isTaskQueueVisible = taskQueue => {
    return !taskQueue.extra || !taskQueue.extra.hide;
  };

  renderList = () => {
    const { taskQueues } = this.props;
    const { selected, showingAll } = this.state;

    const visibleTaskQueues = taskQueues.filter(this.isTaskQueueVisible);
    const restrictedTaskQueues = showingAll
      ? visibleTaskQueues
      : visibleTaskQueues.slice(0, INITIAL_SHOW_COUNT);

    return restrictedTaskQueues.map(taskQueue => (
      <TaskQueue
        key={taskQueue.id}
        item={taskQueue}
        onSelect={this.onSelect}
        isSelected={selected === taskQueue.name}
      />
    ));
  };

  toggleShowingAll = () => {
    this.setState(({ showingAll }) => ({ showingAll: !showingAll }));
  };

  render() {
    const { taskQueues, loading } = this.props;
    const { showingAll } = this.state;

    // Loading state
    if (loading) {
      return (
        <div
          className={css`
            text-align: center;
          `}
        >
          <Spin
            data-testid="loader"
            indicator={
              <Icon
                type="loading"
                className={css`
                  font-size: 24px;
                  color: white;
                `}
                spin
              />
            }
          />
        </div>
      );
    }

    if (taskQueues && taskQueues.length) {
      return (
        <div>
          <StyledTaskQueueHeading>TASK QUEUES</StyledTaskQueueHeading>
          <ul
            className={css`
              padding: 0;
              list-style-type: none;
            `}
          >
            {this.renderList()}
            <StyledLastListItem>
              <ToggleListSizeButton
                showingAll={showingAll}
                onClick={this.toggleShowingAll}
              />
            </StyledLastListItem>
          </ul>
        </div>
      );
    }

    return null;
  }
}

export default TaskQueueList;

function ToggleListSizeButton({ showingAll, onClick }) {
  return (
    <StyledToggleListSizeContainer onClick={onClick}>
      {showingAll ? "SHOW LESS" : "SHOW ALL"}
    </StyledToggleListSizeContainer>
  );
}

const StyledTaskQueueHeading = styled.h1`
  color: #138bd4;
  margin: 30px 0px 20px 15px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
`;

const StyledLastListItem = styled.li`
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
`;

const StyledToggleListSizeContainer = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
`;

/**

  <li
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.3)",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
                display: taskQueues && taskQueues.length > 0 ? "flex" : "none"
              }}
            >
              <div>
                <i
                  className="material-icons"
                  style={{
                    fontSize: 22,
                    color: "#CFDAE3",
                    margin: "0px 10px 2px 0px",
                    verticalAlign: "bottom"
                  }}
                >
                  person
                </i>
                <span style={{ fontSize: 16, color: "#CFDAE3" }}>My Tasks</span>
              </div>
              <span style={{ fontSize: 14, color: "#567C9C" }}>{2}</span>
            </li>

 */
