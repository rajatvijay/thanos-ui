import React, { Component } from "react";
import { Icon, Spin } from "antd";

import Alerts from "./Alerts";

class AlertList extends Component {
  state = { selected: "" };

  onSelect = item => {
    const { onSelectAlert } = this.props;

    if (this.state.selected === item.name) {
      this.setState({ selected: "" });
    } else {
      this.setState({ selected: item["name"] });
    }

    onSelectAlert(item);
  };

  renderList = () => {
    const { alert_details, loading } = this.props.workflowAlertGroupCount;

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
    } else if (alert_details) {
      return alert_details.map(item => {
        return (
          <Alerts
            loading={loading}
            selected={this.state.selected}
            onSelect={this.onSelect}
            item={item}
          />
        );
      });
    }
  };

  render() {
    const { alert_details } = this.props.workflowAlertGroupCount;
    return (
      <div>
        <div
          style={{
            color: "#138BD4",
            margin: "40px 0px 20px 15px",
            fontSize: 12,
            fontWeight: "bold",
            letterSpacing: "0.8px",
            display:
              alert_details && alert_details.length > 0 ? "block" : "none"
          }}
        >
          ALERTS
        </div>
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>{this.renderList()}</ul>
        </div>
      </div>
    );
  }
}

export default AlertList;
