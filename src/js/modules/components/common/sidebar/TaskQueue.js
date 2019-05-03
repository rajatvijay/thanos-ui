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
  renderList = () => {
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;
    const { onSelectTask } = this.props;

    if (stepgroupdef_counts) {
      return stepgroupdef_counts.map(item => {
        if (!item.extra || !item.extra.hide) {
          return (
            <Menu.Item
              className="ant-menu-item"
              key={item.id}
              style={{
                borderTop: "1px solid black",
                color: "white",
                padding: "0px 29px",
                fontSize: 17
              }}
              onClick={() => onSelectTask(item)}
            >
              {item.name} ({item.count})
            </Menu.Item>
          );
        }
      });
    }
    return <Menu.Item />;
  };

  render() {
    return (
      <div>
        <div
          style={{
            margin: 10,
            color: "#138BD4",
            marginBottom: 35,
            fontSize: 12
          }}
        >
          TASK QUEUES
        </div>

        {this.renderList()}
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
