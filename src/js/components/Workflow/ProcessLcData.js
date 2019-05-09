import React from "react";
import Moment from "react-moment";

export const ProcessLcData = lc => {
  let subtext_value = <span />;

  if (lc.format === "date") {
    subtext_value = <Moment format="MM/DD/YYYY">{lc.value || "-"}</Moment>;
  } else if (lc.format && lc.format.toLowerCase() === "pid") {
    subtext_value = <span className="t-upr">{lc.value || "-"}</span>;
  } else if (lc.format && lc.format.toLowerCase() === "icon") {
    subtext_value = lc.value ? (
      <span
        onClick={() => {
          window.open(lc.value, "_blank");
        }}
        className="text-nounderline text-anchor"
      >
        <i className="material-icons">picture_as_pdf</i>
      </span>
    ) : (
      "-"
    );
  } else {
    subtext_value = <span>{lc.value || "-"}</span>;
  }

  return subtext_value;
};
