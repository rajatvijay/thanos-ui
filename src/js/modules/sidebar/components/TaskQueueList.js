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
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;

    const { selected, showMore } = this.state;

    if (loading) {
      return (
        <div style={{ textAlign: "center" }}>
          <Spin
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
    } else if (stepgroupdef_counts) {
      return stepgroupdef_counts.map((item, index) => {
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
    const { stepgroupdef_counts } = this.props.workflowGroupCount;
    const { showMore } = this.state;

    return (
      <div>
        <div
          style={{
            margin: 10,
            color: "#138BD4",
            margin: "30px 0px 20px 15px",
            fontSize: 12,
            fontWeight: "bold",
            letterSpacing: "0.8px",
            display:
              stepgroupdef_counts && stepgroupdef_counts.length > 0
                ? "block"
                : "none"
          }}
        >
          TASK QUEUES
        </div>
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>
            <li
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.3)",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
                display:
                  stepgroupdef_counts && stepgroupdef_counts.length > 0
                    ? "flex"
                    : "none"
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
                display:
                  stepgroupdef_counts && stepgroupdef_counts.length > 4
                    ? "flex"
                    : "none"
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
