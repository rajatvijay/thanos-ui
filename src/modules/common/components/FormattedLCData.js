import React from "react";
import FormattedTextInput from "./FormattedTextInput";
import { supportedFieldFormats } from "../../../config";

//Checks for different type of lc data and renders accordingly
export const FormattedLCData = React.memo(props => {
  const { value, label } = props;

  if (!value) return null;

  let format = props.format || "";
  // TODO :
  // Hardcoded check, must be removed once we are getting
  // data.format === "duns"
  if (label === "D-U-N-S" && !format) format = "duns";

  switch (format) {
    case "icon":
      return <LCIcon {...props} />;

    default:
      if (supportedFieldFormats[format])
        return <LCFormattedText {...props} format={format} />;
  }

  return <LCSimpleText {...props} />;
});

const LCIcon = React.memo(({ value, className }) => (
  <a
    className={className}
    href={value}
    title={value}
    target="_blank"
    rel="noopener noreferrer"
  >
    {value}
  </a>
));

const LCFormattedText = React.memo(({ value, className, format }) => (
  <span title={value} className={className}>
    <FormattedTextInput
      displayType="text"
      format={supportedFieldFormats[format]}
      value={value}
    />
  </span>
));

const LCSimpleText = React.memo(({ value, className }) => (
  <span title={value} className={className}>
    {value}
  </span>
));
