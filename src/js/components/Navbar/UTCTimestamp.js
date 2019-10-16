import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Tooltip } from "antd";

export const Timestamp = React.memo(({ timestamp }) => {
  let gmtFormat = new Date(timestamp);
  gmtFormat = gmtFormat.toString();

  const date = new Date(timestamp);

  return (
    <span className="small text-light">
      <Tooltip title={gmtFormat}>
        {formatDistanceToNow(date, { addSuffix: true })}
      </Tooltip>
    </span>
  );
});
