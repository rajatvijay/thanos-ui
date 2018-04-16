import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row, Col, Avatar, Progress, Tag, Popover } from "antd";
import _ from "lodash";

import { Text, Bool, Number } from "./fields";
// export { text } from "./fields";

export const getFieldType = props => {
  switch (props.field.field_type) {
    case "text":
      return Text(props);
    case "bool":
      return Bool(props);
    case "number":
      return Number(props);

    default:
      return "grey";
  }
};
