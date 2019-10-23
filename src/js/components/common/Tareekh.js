import React from "react";
import { format as dateFormat, isValid } from "date-fns";

export const Tareekh = React.memo(({ timestamp, format, style, className }) => {
  const date = new Date(timestamp);

  if (!isValid(date)) {
    return;
  }

  return (
    <span style={style} className={className}>
      {dateFormat(date, format || "yyyy-MMM-dd")}
    </span>
  );
});
