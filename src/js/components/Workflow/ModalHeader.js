import React, { Component } from "react";
import { HeaderLcData, GetMergedData } from "./WorkflowHeader";
import FullScreen from "../../../images/fullScreenBlack.svg";
import { history } from "../../_helpers";

class ModalHeader extends Component {
  handleExpand = e => {
    e.preventDefault();
    const { stepId, groupId, workflow } = this.props;
    const link =
      !stepId && !groupId
        ? "/workflows/instances/" + workflow.id + "/"
        : "/workflows/instances/" +
          workflow.id +
          "?step=" +
          stepId +
          "&group=" +
          groupId;
    this.props.toggleMinimalUI();
    history.push(link);
  };
  render() {
    const { workflow } = this.props;

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
          <HeaderLcData {...this.props} />

          <GetMergedData {...this.props} />

          <span>{workflow.status.label}</span>

          <a href="/" onClick={this.handleExpand}>
            <img style={{ width: 20 }} src={FullScreen} alt="expand" />
          </a>
        </div>
      </div>
    );
  }
}

export default ModalHeader;
