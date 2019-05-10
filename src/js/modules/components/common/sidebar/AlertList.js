import React, { Component } from "react";
import Collapsible from "react-collapsible";
import { Icon } from "antd";

class AlerList extends Component {
  state = { collapse: false };

  // onOpen = ()=>{

  // }

  renderList = () => {
    const { onSelect, item, selected } = this.props;
    //const {selected} = this.state

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
            margin: "4px 30px",
            backgroundColor: item["name"] === selected ? "#1489D2" : "#2F4E67",
            borderRadius: "10px",
            padding: "1px 2px 1px 13px",
            color: "white",
            cursor: "pointer"
          }}
        >
          <span>{item.name}</span>
          <span
            style={{
              borderRadius: "50%",
              backgroundColor: "#D40000",
              color: "white",
              margin: "0px 5px",
              width: 25,
              height: 25,
              lineHeight: "25px",
              textAlign: "center",
              fontSize: 10
            }}
          >
            {item.count}
          </span>
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
            borderTop: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 29px",
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
              <span
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#D40000",
                  color: "white",
                  margin: "0px 5px",
                  width: 25,
                  height: 25,
                  lineHeight: "25px",
                  textAlign: "center",
                  fontSize: 10,
                  display: "inline-block"
                }}
              >
                {item.count}
              </span>
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
