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
import AlertList from './AlertList'

export default class Alerts extends Component {
//   renderList = () => {
//     const { alert_details } = this.props.workflowAlertGroupCount;
//     const { onSelectAlert } = this.props;

//     if (alert_details) {
//       return alert_details.map(item => {
//         return (
//           <Menu.Item
//             style={{
//               borderTop: "1px solid black",
//               color: "white",
//               padding: "0px 29px",
//               fontSize: 17
//             }}
//             key={item.id}
//             className="ant-menu-item"
//             onClick={() => onSelectAlert(item)}
//           >
//             {item.name} ({item.count})
//           </Menu.Item>
//         );
//       });
//     }
//     return <Menu.Item />;
//   };


renderList = () => {
    const { alert_details } = this.props.workflowAlertGroupCount;
         const { onSelectAlert } = this.props;

    if (alert_details) {
      return alert_details.map(item => {
        
          return (

            <AlertList item={item}/>
            // <li
            //   onClick={() => this.props.onSelectAlert(item)}
            //   style={{
            //     borderTop: "1px solid black",
            //     display: "flex",
            //     justifyContent: "space-between",
            //     padding: "10px 29px",
            //     cursor: "pointer"
            //   }}
            // >
            //   <span style={{ fontSize: 16, color: "#CFDAE3" }}>
            //     {item.name}
            //   </span>
            //   <div>
            //     {item.count > 0 && (
            //       <span
            //         style={{
            //           borderRadius: "50%",
            //           backgroundColor: "#D40000",
            //           color: "white",
            //           margin: "0px 5px",
            //           padding: 2,
            //           fontSize:12
            //         }}
            //       >
            //         {item.count}
            //       </span>
            //     )}
               
            //   </div>
            // </li>
          );
        
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
            margin: "40px 0px 20px 15px",
            fontSize: 12
          }}
        >
          ALERTS
        </div>
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>{this.renderList()}</ul>
        </div>
      </div>
    )
    
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