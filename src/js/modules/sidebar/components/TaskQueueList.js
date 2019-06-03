import React, { Component } from "react";
import { Icon, Spin } from "antd";

import TaskQueue from "./TaskQueue";

class TaskQueueList extends Component {
  state = { selected: "", showMore: true };

  onSelect = item => {
    const { onSelectTask } = this.props;

    if (this.state.selected == item.name) {
      this.setState({ selected: "" });
      onSelectTask();
    } else {
      this.setState({ selected: item["name"] });
      onSelectTask(item);
    }
  };

  renderList = () => {
    const { taskQueues, loading } = this.props;
    const { selected, showMore } = this.state;

    if (loading) {
      return (
        <div style={{ textAlign: "center" }}>
          <Spin
            data-testid="loader"
            indicator={
              <Icon
                type="loading"
                style={{ fontSize: "24px", color: "white" }}
                spin
              />
            }
          />
        </div>
      );
    } else if (taskQueues) {
      return taskQueues.map((item, index) => {
        if (!item.extra || !item.extra.hide) {
          if (showMore && index < 5) {
            return (
              <TaskQueue
                item={item}
                onSelect={this.onSelect}
                selected={selected}
              />
            );
          } else if (!showMore) {
            return (
              <TaskQueue
                item={item}
                onSelect={this.onSelect}
                selected={selected}
              />
            );
          }
        }
      });
    }
  };

  render() {
    const { taskQueues } = this.props;
    const { showMore } = this.state;

    return (
      <div>
        {taskQueues && taskQueues.length ? (
          <div
            style={{
              margin: 10,
              color: "#138BD4",
              margin: "30px 0px 20px 15px",
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: "0.8px"
            }}
          >
            TASK QUEUES
          </div>
        ) : null}
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>
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
            {this.renderList()}
            <li
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.3)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
                justifyContent: "space-between",
                padding: "10px 20px",
                display: taskQueues && taskQueues.length > 4 ? "flex" : "none"
              }}
            >
              <div>
                <span
                  onClick={() => this.setState({ showMore: !showMore })}
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.3)",
                    cursor: "pointer"
                  }}
                >
                  {showMore ? "SHOW ALL" : "SHOW LESS"}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TaskQueueList;
