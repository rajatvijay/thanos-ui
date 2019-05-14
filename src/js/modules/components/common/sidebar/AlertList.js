import React, { Component } from "react";
import Collapsible from "react-collapsible";
import { Icon } from "antd";
import SidebarCircle from "./SidebarCircle";

class AlerList extends Component {
  state = { collapse: false };

  renderList = () => {
    const { onSelect, item, selected } = this.props;

    if (item.sub_categories) {
      return item.sub_categories.map(item => (
        <li
          onClick={e => {
            e.stopPropagation();
            onSelect(item);
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "4px 18px 4px 25px",
            backgroundColor:
              item["name"] === selected
                ? "#1489D2"
                : "rgba(255, 255, 255, 0.15)",
            borderRadius: "30px",
            padding: "3px 3px 0px 12px",
            color: "white",
            cursor: "pointer"
          }}
        >
          <span>{item.name}</span>
          <SidebarCircle innerColour="#D40000" value={item.count} />
        </li>
      ));
    }
  };

  render() {
    const { collapse } = this.state;
    const { item } = this.props;

    return (
      <li
        style={{
          paddingBottom: collapse ? 30 : 0,
          backgroundColor: collapse ? "#093050" : "#104775",
          transitionDuration: "500ms"
        }}
        onClick={() => this.setState({ collapse: !collapse })}
      >
        <div
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          <div>
            <Icon
              style={{ margin: "0px 5px 0px -5px", color: "white" }}
              type="caret-right"
              rotate={collapse ? 90 : 0}
            />
            <span style={{ fontSize: 16, color: "#CFDAE3" }}>{item.name}</span>
          </div>
          <div>
            {item.count > 0 && (
              <SidebarCircle innerColour="#D40000" value={item.count} />
            )}
          </div>
        </div>

        <Collapsible open={collapse}>
          <ul style={{ padding: 0 }}>{this.renderList()}</ul>
        </Collapsible>
      </li>
    );
  }
}

export default AlerList;
