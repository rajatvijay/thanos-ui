import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Divider,
  Badge,
  Tag,
  Tooltip,
  Typography,
  Spin
} from "antd";
//import { Icon, Divider, Badge, Tag, Tooltip } from "antd";
import _ from "lodash";
import List from './List'

export default class TaskQueue extends Component {
  state = { selected: "",showMore:true };

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
    //const { onSelectTask } = this.props;
    const { selected ,showMore} = this.state;

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
    }

    else if (stepgroupdef_counts) {
      return stepgroupdef_counts.map((item,index )=> {
       
        if (!item.extra || !item.extra.hide) {
          if(showMore && index <5){
          return (
           <List item={item} onSelect={this.onSelect} selected={selected}  />
          );
          }
          else if(!showMore){
            return <List item={item} onSelect={this.onSelect} selected={selected}  />
          }
        }
      });
    }
  };

  render() {

    const { stepgroupdef_counts } = this.props.workflowGroupCount;
    const {showMore} = this.state

    return (
      <div>
        <div
          style={{
            margin: 10,
            color: "#138BD4",
            margin: "30px 0px 20px 15px",
            fontSize: 12,
            display:stepgroupdef_counts&&stepgroupdef_counts.length>0?"block":"none"
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
                padding: "10px 29px",
                display:stepgroupdef_counts&&stepgroupdef_counts.length>0?"flex":"none"
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
            <li
              style={{
                borderTop: "1px solid black",
                borderBottom:"1px solid black",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 29px",
                display:stepgroupdef_counts&&stepgroupdef_counts.length>0?"flex":"none"
              }}
            >
              <div>
                
                <span onClick={()=>this.setState({showMore:!showMore})} style={{ fontSize: 14, color: "#587D9D",cursor:"pointer" }}>{showMore?"SHOW ALL":"SHOW LESS"}</span>
              </div>
              
            </li>
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
