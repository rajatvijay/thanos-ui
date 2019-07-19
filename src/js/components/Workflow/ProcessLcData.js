import React from "react";
import Moment from "react-moment";
import moment from "moment";

export const ProcessLcData = (lc, is_alert) => {
  let subtext_value = <span />;

  if (lc.format === "date") {
    if (moment(lc.value, moment.ISO_8601).isValid()) {
      subtext_value = (
        <Moment format="MM/DD/YYYY">{lc.value || (is_alert ? "" : "-")}</Moment>
      );
    } else {
      return "";
    }
  } else if (lc.format && lc.format.toLowerCase() === "pid") {
    subtext_value = (
      <span className="t-upr">{lc.value || (is_alert ? "" : "-")}</span>
    );
  } else if (lc.format && lc.format.toLowerCase() === "icon") {
    subtext_value = lc.value ? (
      <a
        href={lc.value}
        target="_blank"
        className="text-nounderline text-anchor"
      >
        <i className="material-icons">picture_as_pdf</i>
      </a>
    ) : is_alert ? (
      ""
    ) : (
      "-"
    );
  } else {
    subtext_value = <span>{lc.value || (is_alert ? "" : "-")}</span>;
  }

  return subtext_value;
};
