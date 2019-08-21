import React from "react";

//Checks for different type of lc data and renders accordingly
export const FormattedLCData = props => {
  const { data, style } = props;
  const lcStyle = {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...style
  };

  if (data.format && data.format === "icon") {
    return (
      <a style={lcStyle} href={data.value} title={data.value} target="_blank">
        {data.value}
      </a>
    );
  } else {
    return (
      <span title={data.value} style={style}>
        {data.value}
      </span>
    );
  }
};
