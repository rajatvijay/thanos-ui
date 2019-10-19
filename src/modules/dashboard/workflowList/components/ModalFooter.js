import React from "react";
import FullScreen from "../../../../images/fullScreenWhite.svg";
import { history } from "../../../../js/_helpers";
import { FormattedMessage } from "react-intl";

class ModalFooter extends React.Component {
  handleExpand = e => {
    e.preventDefault();
    const { stepId, groupId, workflowIdFromPropsForModal } = this.props;
    const link =
      !stepId && !groupId
        ? "/workflows/instances/" + workflowIdFromPropsForModal + "/"
        : "/workflows/instances/" +
          workflowIdFromPropsForModal +
          "?step=" +
          stepId +
          "&group=" +
          groupId;
    this.props.toggleMinimalUI();
    history.push(link);
  };
  render() {
    return (
      <div
        style={{
          width: "100%",
          position: "absolute",
          backgroundColor: " #148CD6",
          textAlign: "center",
          padding: "10px 0px",
          bottom: 0,
          zIndex: 1,
          fontSize: 18
        }}
      >
        <a
          style={{ color: "white", textDecoration: "none" }}
          href="/"
          onClick={this.handleExpand}
        >
          <FormattedMessage id="commonTextInstances.expandView" />
          <img
            style={{ width: 20, marginLeft: 20 }}
            alt="expand"
            src={FullScreen}
          />
        </a>
      </div>
    );
  }
}

export default ModalFooter;
