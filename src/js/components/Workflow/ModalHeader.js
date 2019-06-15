import React, { Component } from "react";

class ModalHeader extends Component {
  render() {
    const { title, workflow } = this.props;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 30px",
          alignItems: "center",
          position: "fixed",
          zIndex: 999,
          width: 1100,
          backgroundColor: "white"
        }}
      >
        <h2>{workflow.name}</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexBasis: "50%"
          }}
        >
          <span style={{ color: "#C3C3C3" }}>United kingdom</span>

          <span>2</span>

          <span>{workflow.status.label}</span>

          <span>Design</span>
        </div>
      </div>
    );
  }
}

export default ModalHeader;
