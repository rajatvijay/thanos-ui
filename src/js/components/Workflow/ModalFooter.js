import React from "react";

import { Link } from "react-router-dom";

function ModalFooter(props) {
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
        to={"/workflows/instances/" + props.wfID + "/"}
      >
        Expand View
      </Link>
    </div>
  );
}

export default ModalFooter;
