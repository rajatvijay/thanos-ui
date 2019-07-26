import React from "react";

import { Link } from "react-router-dom";
import FullScreen from "../../../images/fullScreenWhite.svg";

function ModalFooter(props) {
  const { stepId, groupId, workflowIdFromPropsForModal } = props;

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
      <Link
        style={{ color: "white", textDecoration: "none" }}
        to={
          !stepId && !groupId
            ? "/workflows/instances/" + workflowIdFromPropsForModal + "/"
            : "/workflows/instances/" +
              workflowIdFromPropsForModal +
              "?step=" +
              stepId +
              "&group=" +
              groupId
        }
      >
        Expand View
        <img style={{ width: 20, marginLeft: 20 }} src={FullScreen} alt="" />
      </Link>
    </div>
  );
}

export default ModalFooter;
