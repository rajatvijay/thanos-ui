import React, { Component } from "react";
import { Row, Col } from "antd";

class ProfileStepBody extends Component {
  renderDetails() {
    const { workflowHead } = this.props;
    console.log("work", workflowHead);

    const lc_data = workflowHead.lc_data.filter(
      item => item.display_type === "normal" && item.value
    );

    return lc_data.map(data => (
      <Col span={12}>
        <span
          style={{
            opacity: 0.3,
            color: "#000000",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "-0.02px",
            lineHeight: "15px"
          }}
        >
          {data.label}
        </span>
        <br />
        <span
          style={{
            color: "#000000",
            fontSize: "12px",
            letterSpacing: "-0.02px",
            lineHeight: "29px",
            wordWrap: "break-word"
          }}
        >
          {data.value}
        </span>
      </Col>
    ));
  }

  render() {
    console.log("head", this.props.workflowHead);

    if (!this.props.workflowHead) {
      return null;
    }

    return (
      <div style={{ margin: 50, height: "100vh" }}>
        <Row>{this.renderDetails()}</Row>
      </div>
    );
  }
}

export default ProfileStepBody;
