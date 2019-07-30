import React from "react";
import { Row, Col } from "antd";

function LCData({ lcData, status }) {
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
          STATUS
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
      ))}
    </Row>
  );
}

export default LCData;
