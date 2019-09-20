import React from "react";
import { Tag, Popover, Icon } from "antd";
import { css } from "emotion";

const FieldAlerts = ({ alerts }) => {
  if (alerts.length < 3) {
    return alerts.map(item => (
      <FieldAlertItem key={item.alert.id} alert={item} />
    ));
  }

  const first3Alerts = alerts.slice(0, 3);
  return (
    <>
      {first3Alerts.map(item => (
        <FieldAlertItem key={item.alert.id} alert={item} />
      ))}
      <Popover
        trigger="click"
        content={alerts.map(function(item) {
          return <FieldAlertItem alert={item} />;
        })}
      >
        <Icon type="plus-circle" data-testid="plus-icon" />
      </Popover>
    </>
  );
};

export default FieldAlerts;

const FieldAlertItem = ({ alert }) => {
  return (
    <Tag
      style={{ backgroundColor: alert.alert.category.color_label }}
      className={css`
        color: white;
        border: none;
        border-radius: 10px;
      `}
    >
      {alert.alert.tag}
      {/* TODO: Add cross icon, later */}
    </Tag>
  );
};
