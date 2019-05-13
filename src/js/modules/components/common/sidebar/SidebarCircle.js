import React from "react";

const SidebarCircle = ({ value, innerColour }) => {
  return (
    <span
      style={{
        borderRadius: "50%",
        backgroundColor: innerColour,
        color: "white",
        margin: "0px 5px",
        fontSize: 10,
        width: 25,
        height: 25,
        lineHeight: "25px",
        textAlign: "center",
        display: "inline-block"
      }}
    >
      {value}
    </span>
  );
};

export default SidebarCircle;
