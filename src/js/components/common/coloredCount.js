import React from "react";
import { css } from "emotion";

const ColoredCount = ({ text, color }) => {
  return (
    <span
      className={css`
        display: block;
        font-weight: 500;
        font-size: 13px;
        color: white;
        background: ${color};
        height: 20px;
        width: 20px;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
      `}
    >
      {text}
    </span>
  );
};

export default ColoredCount;
