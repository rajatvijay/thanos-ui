import React from "react";
import FormattedTextInput from "./FormattedTextInput";
import { supportedFieldFormats } from "../../../config";
import { Tag, Tooltip } from "antd";

//Checks for different type of lc data and renders accordingly
export const FormattedLCData = React.memo(props => {
  const { value, label } = props;

  if (!value) return null;

  let format = props.format || "";
  // TODO :
  // Hardcoded check, must be removed once we are getting
  // data.format === "duns"
  if (label === "D-U-N-S" && !format) format = "duns";
  if (value.includes("~") && !format) format = "tags";

  switch (format) {
    case "icon":
      return <LCIcon {...props} />;

    case "tags":
      return <LCTags {...props} />;

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
    <i className="material-icons">picture_as_pdf</i>
  </a>
));

const LCFormattedText = React.memo(({ value, className, format }) => (
  <Tooltip
    title={
      <FormattedTextInput
        displayType="text"
        format={supportedFieldFormats[format]}
        value={value}
      />
    }
  >
    <FormattedTextInput
      displayType="text"
      format={supportedFieldFormats[format]}
      value={value}
    />
  </Tooltip>
));

const LCSimpleText = React.memo(({ value, className }) => (
  <span title={value} className={className}>
    {value}
  </span>
));

const LCTags = React.memo(({ value, className }) => (
  <span title={value} className={className}>
    {value.split("~").map((tag, index) => {
      return (
        <Tag title={tag} key={index + ""}>
          {tag}
        </Tag>
      );
    })}
  </span>
));
