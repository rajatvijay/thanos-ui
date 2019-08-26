import React, { Component } from "react";
import { Row, Col } from "antd";
import { Chowkidaar } from "../../../modules/common/permissions/Chowkidaar";
import Permissions from "../../../modules/common/permissions/constants";
import { FormattedLCData } from "../../../modules/common/components/FormattedLCData";

class ProfileStepBody extends Component {
  renderDetails() {
    const { workflowHead } = this.props;

    const lc_data = workflowHead.lc_data.filter(
      item => item.display_type === "normal" && item.value
    );

    const style = {
      color: "#000000",
      fontSize: "16px",
      letterSpacing: "-0.02px",
      lineHeight: "29px",
      wordWrap: "break-word"
    };

    return lc_data.map((data, index) => (
      <Col style={{ margin: "0px 0px 25px 0px" }} span={12} key={`${index}`}>
        <span
          style={{
            opacity: 0.3,
            color: "#000000",
            fontSize: "20px",
            letterSpacing: "-0.02px",
            lineHeight: "15px"
          }}
        >
          {data.label}
        </span>
        <br />
        <FormattedLCData data={data} style={style} />
      </Col>
    ));
  }

  render() {
    if (!this.props.workflowHead) {
      return null;
    }

    return (
      <div style={{ margin: "40px 50px", height: "100vh" }}>
        <Chowkidaar check={Permissions.CAN_VIEW_WORKFLOW_PROFILE}>
          <Row>{this.renderDetails()}</Row>
        </Chowkidaar>
      </div>
    );
  }
}

export default ProfileStepBody;
