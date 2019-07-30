import React from "react";
import { Row, Col } from "antd";

function SidebarTopFields({ lc_data, status }) {
  return (
    <Row>
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
      {lc_data.map((data, index) => (
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

export default SidebarTopFields;
