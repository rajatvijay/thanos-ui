import React from "react";
import { Row, Col } from "antd";
import { FormattedMessage } from "react-intl";
import { FormattedLCData } from "../../../../modules/common/FormattedLCData";

function LCData({ lcData, status }) {
  const style = {
    color: "#000000",
    fontSize: "12px",
    letterSpacing: "-0.02px",
    lineHeight: "29px",
    wordWrap: "break-word"
  };

  return (
    <Row style={{ "margin-bottom": 12 }}>
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
          <FormattedMessage id="workflowsInstances.statusText" />
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
          {status}
        </span>
      </Col>
      {lcData.map((data, index) => (
        <Col span={12} key={`${index}`}>
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
          <FormattedLCData data={data} style={style} />
        </Col>
      ))}
    </Row>
  );
}

export default LCData;
