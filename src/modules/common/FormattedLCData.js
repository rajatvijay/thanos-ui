import React from "react";

//Checks for different type of lc data and renders accordingly
export const FormattedLCData = props => {
  const { data, className } = props;
  if (data.format === "icon") {
    return (
      <a
        className={className}
        href={data.value}
        title={data.value}
        target="_blank"
        rel="noopener noreferrer"
      >
        {data.value}
      </a>
    );
  } else {
    return (
      <span title={data.value} className={className}>
        {data.value}
      </span>
    );
  }
};
