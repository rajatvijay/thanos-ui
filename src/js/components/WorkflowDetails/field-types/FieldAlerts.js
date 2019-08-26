import React from "react";
import { Tag } from "antd";
import { css } from "emotion";

const FieldAlerts = ({ alerts }) => {
  return alerts.map(function(item) {
    return (
      <Tag
        key={item.alert.id}
        style={{ backgroundColor: item.alert.category.color_label }}
        className={css`
          color: white;
          border: none;
          border-radius: 10px;
        `}
      >
        {item.alert.tag}
        {/* TODO: Add cross icon, later */}
      </Tag>
    );
  });
};

export default FieldAlerts;
