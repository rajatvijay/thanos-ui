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

export default class Alerts extends Component {
  renderList = () => {
    const { alert_details } = this.props.workflowAlertGroupCount;
    const { onSelectAlert } = this.props;

    if (alert_details) {
      return alert_details.map(item => {
        return (
          <Menu.Item
            style={{
              borderTop: "1px solid black",
              color: "white",
              padding: "0px 29px",
              fontSize: 17
            }}
            key={item.id}
            className="ant-menu-item"
            onClick={() => onSelectAlert(item)}
          >
            {item.name} ({item.count})
          </Menu.Item>
        );
      });
    }
    return <Menu.Item />;
  };

  render() {
    return (
      <div style={{ marginTop: 100 }}>
        <div
          style={{
            margin: 10,
            color: "#138BD4",
            marginBottom: 35,
            fontSize: 12
          }}
        >
          ALERTS
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
