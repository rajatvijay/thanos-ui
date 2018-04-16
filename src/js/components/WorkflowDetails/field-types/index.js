import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row, Col, Avatar, Progress, Tag, Popover } from "antd";
import _ from "lodash";

import { Text, Bool, Number } from "./fields";
// export { text } from "./fields";

export const getFieldType = props => {
  console.log(props);

  switch (props.field_type) {
    case "text":
      return Text(props);
    case "bool":
      return Bool(props);
    case "number":
      return Number(props);

    default:
      return "grey";
  }

  return <div>field type</div>;
};
