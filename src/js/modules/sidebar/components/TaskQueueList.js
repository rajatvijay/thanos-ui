import React, { Component } from "react";
import { Icon, Spin } from "antd";
import styled from "@emotion/styled";
import { css } from "emotion";
import { TaskQueue, DefaultTaskQueue } from "./TaskQueue";
import user from "../../../../images/user.svg";
import { stepBodyService } from "../../../services";

const INITIAL_SHOW_COUNT = 5;

class TaskQueueList extends Component {
  state = {
    selected: null,
    showingAll: false,
    myTasksCount: null,
    loadingMyTasksCount: false
  };

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

  getMyTasksCount = async () => {
    this.setState({ loadingMyTasksCount: true });
    try {
      const response = await stepBodyService.getMyTasksCount();
      this.setState({
        myTasksCount: response["Assignee"] || 0,
        loadingMyTasksCount: false
      });
    } catch (e) {
      this.setState({ myTasksCount: null, loadingMyTasksCount: false });
    }
  };

  componentDidMount() {
    this.getMyTasksCount();
  }

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

  toggleMyTaskFilter = () => {
    const { isMyTaskSelected } = this.props;
    if (isMyTaskSelected) {
      // Remove the filter
      this.props.onSelectMyTask();
    } else {
      // Apply the filter
      this.props.onSelectMyTask("Assignee");
    }
  };

  render() {
    const { taskQueues, loading, isMyTaskSelected } = this.props;
    const { showingAll, loadingMyTasksCount, myTasksCount } = this.state;

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
            <DefaultTaskQueue
              item={{ name: "My Tasks", count: myTasksCount, image: user }}
              loading={loadingMyTasksCount}
              onClick={this.toggleMyTaskFilter}
              isSelected={isMyTaskSelected}
            />
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
