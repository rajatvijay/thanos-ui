import React from "react";

const SidebarCircle = ({ value, innerColour }) => {
  return (
    <span
      style={{
        borderRadius: "20px",
        backgroundColor: innerColour,
        color: "white",
        margin: "0px",
        padding: "0px 7px",
        fontSize: "14px",
        width: "auto",
        minWidth: "20px",
        height: "20px",
        lineHeight: "20px",
        textAlign: "center",
        display: "inline-block"
      }}
    >
      {value}
    </span>
  );
};

export default SidebarCircle;
