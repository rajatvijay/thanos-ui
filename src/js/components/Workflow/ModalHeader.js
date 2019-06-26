import React, { Component } from "react";
import { HeaderLcData, GetMergedData } from "./WorkflowHeader";
import FullScreen from "../../../images/fullScreenBlack.svg";
import { Link } from "react-router-dom";

class ModalHeader extends Component {
  render() {
    const { workflow, stepId, groupId } = this.props;

    console.log("ids", stepId, groupId);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 30px",
          alignItems: "center",
          position: "absolute",
          zIndex: 1,
          width: "77vw",
          backgroundColor: "white",
          paddingRight: "60px",
          boxShadow: "rgba(0,0,0,0.05) 0px 5px 10px"
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

          <Link
            to={
              !stepId && !groupId
                ? "/workflows/instances/" + workflow.id + "/"
                : "/workflows/instances/" +
                  workflow.id +
                  "?step=" +
                  stepId +
                  "&group=" +
                  groupId
            }
          >
            <img style={{ width: 20 }} src={FullScreen} />
          </Link>
        </div>
      </div>
    );
  }
}

export default ModalHeader;
