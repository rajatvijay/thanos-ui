import React, { PureComponent } from "react";
import { Icon, Spin } from "antd";
import styled from "@emotion/styled";
import { css } from "emotion";
import { TaskQueue } from "./TaskQueue";
import { FormattedMessage, injectIntl } from "react-intl";
import { get as lodashGet } from "lodash";
import MyTaskFilter from "./MyTaskFilter";

const INITIAL_SHOW_COUNT = 5;

class TaskQueueList extends PureComponent {
  state = {
    showingAll: false
  };

  onSelect = taskQueue => {
    const { onSelectTask } = this.props;
    const activeTaskQueue = lodashGet(
      this.props,
      "activeTaskQueue.stepgroupdef.filterValue.0",
      null
    );

    if (activeTaskQueue === taskQueue.tag) onSelectTask();
    else onSelectTask(taskQueue);
  };

  isTaskQueueVisible = taskQueue => {
    return !taskQueue.extra || !taskQueue.extra.hide;
  };

  renderList = () => {
    const { taskQueues } = this.props;
    const { showingAll } = this.state;
    const visibleTaskQueues = taskQueues.filter(this.isTaskQueueVisible);
    const restrictedTaskQueues = showingAll
      ? visibleTaskQueues
      : visibleTaskQueues.slice(0, INITIAL_SHOW_COUNT);
    const activeTaskQueue = lodashGet(
      this.props,
      "activeTaskQueue.stepgroupdef.filterValue.0",
      null
    );
    return restrictedTaskQueues.map(taskQueue => (
      <TaskQueue
        key={`taskQueue_${taskQueue.tag}`}
        item={taskQueue}
        onSelect={this.onSelect}
        isSelected={activeTaskQueue === taskQueue.tag}
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
          <StyledTaskQueueHeading>
            <FormattedMessage id="mainSidebar.taskQueuesText" />
          </StyledTaskQueueHeading>
          <ul
            className={css`
              padding: 0;
              list-style-type: none;
            `}
          >
            <MyTaskFilter
              isSelected={isMyTaskSelected}
              onClick={this.toggleMyTaskFilter}
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

export default injectIntl(TaskQueueList);

function ToggleListSizeButton({ showingAll, onClick }) {
  return (
    <StyledToggleListSizeContainer onClick={onClick}>
      {showingAll ? (
        <FormattedMessage id="mainSidebar.showLessText" />
      ) : (
        <FormattedMessage id="mainSidebar.showAllText" />
      )}
    </StyledToggleListSizeContainer>
  );
}

const StyledTaskQueueHeading = styled.h1`
  color: #138bd4;
  margin: 30px 0px 20px 20px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  text-transform: uppercase;
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
  text-transform: uppercase;
`;
