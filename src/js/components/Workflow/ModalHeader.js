import React, { Component } from "react";
import { HeaderLcData, GetMergedData } from "./WorkflowHeader";
import FullScreen from "../../../images/fullScreenBlack.svg";
import { Link } from "react-router-dom";

class ModalHeader extends Component {
  render() {
    const { workflow } = this.props;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 30px",
          alignItems: "center",
          position: "fixed",
          zIndex: 1,
          width: "77vw",
          backgroundColor: "white",
          paddingRight: "60px"
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
          {/* <span style={{ color: "#C3C3C3" }}>United kingdom</span> */}
          <HeaderLcData {...this.props} />

          {/* <span>2</span> */}
          <GetMergedData {...this.props} />

          <span>{workflow.status.label}</span>

          <Link to={"/workflows/instances/" + workflow.id + "/"}>
            <img style={{ width: 20 }} src={FullScreen} />
          </Link>
        </div>
      </div>
    );
  }
}

export default ModalHeader;
