import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Divider,
  Badge,
  Tag,
  Tooltip,
  Typography
} from "antd";
//import { Icon, Divider, Badge, Tag, Tooltip } from "antd";
import _ from "lodash";

export default class TaskQueue extends Component {
  //   renderList = () => {
  //     const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;
  //     const { onSelectTask } = this.props;

  //     if (stepgroupdef_counts) {
  //       return stepgroupdef_counts.map(item => {
  //         if (!item.extra || !item.extra.hide) {
  //           return (
  //             <Menu.Item
  //               className="ant-menu-item"
  //               key={item.id}
  //               style={{
  //                 borderTop: "1px solid black",
  //                 color: "white",
  //                 padding: "0px 29px",
  //                 fontSize: 17
  //               }}
  //               onClick={() => onSelectTask(item)}
  //             >
  //               {item.name} ({item.count})
  //             </Menu.Item>
  //           );
  //         }
  //       });
  //     }
  //     return <Menu.Item />;
  //   };

  renderList = () => {
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;
    const { onSelectTask } = this.props;

    if (stepgroupdef_counts) {
      return stepgroupdef_counts.map(item => {
        if (!item.extra || !item.extra.hide) {
          return (
            <li
              onClick={() => this.props.onSelectTask(item)}
              style={{
                borderTop: "1px solid black",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 29px",
                cursor: "pointer"
              }}
            >
              <span style={{ fontSize: 16, color: "#CFDAE3" }}>
                {item.name}
              </span>
              <div>
                {item.overdue_count > 0 && (
                  <span
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "#D40000",
                      color: "white",
                      margin: "0px 5px",
                      padding: 4,
                      fontSize: 11
                    }}
                  >
                    {item.overdue_count}
                  </span>
                )}
                <span style={{ fontSize: 12, color: "#567C9C" }}>
                  {item.count}
                </span>
              </div>
            </li>
          );
        }
      });
    }
  };

  render() {
    return (
      <div>
        <div
          style={{
            margin: 10,
            color: "#138BD4",
            margin: "30px 0px 20px 15px",
            fontSize: 12
          }}
        >
          TASK QUEUES
        </div>
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>
            <li
              style={{
                borderTop: "1px solid black",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 29px"
              }}
            >
              <div>
                <Icon
                  style={{
                    fontSize: 22,
                    color: "#CFDAE3",
                    margin: "0px 10px 0px 0px"
                  }}
                  type="user"
                />
                <span style={{ fontSize: 16, color: "#CFDAE3" }}>My Tasks</span>
              </div>
              <span style={{ fontSize: 12, color: "#567C9C" }}>{2}</span>
            </li>
            {this.renderList()}
          </ul>
        </div>
      </div>
    );
  }
}

// {_.map(stepgroupdef_counts, function(item, index) {
//     if (!item.extra || !item.extra.hide) {
//       return (
//         <Menu.Item
//         onClick = {()=>that.onSelectTask(item)}
//           key={item.id}
//          // onClick={that.handleClick.bind(that, item)}
//         >
//          {item.name} ({item.count})
//         </Menu.Item>
//       );
//     }
//   })}
