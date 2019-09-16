import React from "react";
import { css } from "emotion";

const ColoredCount = ({ text, color, ...restProps }) => {
  return (
    <span
      {...restProps}
      className={css`
        display: inline-block;
        font-weight: 500;
        font-size: 13px;
        color: white;
        background: ${color};
        height: 20px;
        width: 20px;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        margin-right: 5px;
      `}
      data-testid="colored-count"
    >
      {text}
    </span>
  );
};

export default ColoredCount;
