import React from "react";
import Moment from "react-moment";
import moment from "moment";
import FormattedTextInput from "./FormattedTextInput";
import { supportedFieldFormats } from "../../../config";

export const LCDataValue = React.memo(({ value, label, format, isAlert }) => {
  if (!value) return <span>{isAlert ? "" : "-"}</span>;
  // TODO
  // To be removed once we get format = "duns"
  if (label === "D-U-N-S" && !format) format = "duns";

  if (!format) format = "";

  switch (format.toLowerCase()) {
    case "date":
      if (moment(value, moment.ISO_8601).isValid())
        return <Moment format="YYYY/MM/DD">{value}</Moment>;
      break;

    case "pid":
      return <span className="t-upr">{value}</span>;

    case "icon":
      return <LCIcon value={value} />;

    default:
      if (supportedFieldFormats[format])
        return (
          <FormattedTextInput
            format={supportedFieldFormats[format]}
            displayType="text"
            value={value}
          />
        );
  }

  return <span>{value}</span>;
});

const LCIcon = React.memo(({ value }) => (
  <a
    href={value}
    target="_blank"
    rel="noopener noreferrer"
    className="text-nounderline text-anchor"
  >
    <i className="material-icons">picture_as_pdf</i>
  </a>
));
