import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  Bool,
  Number,
  List,
  Date,
  Checkbox,
  Email,
  Phone,
  Paragraph,
  Break,
  Select,
  Divider,
  URL,
  Attachment,
  File
} from "./fields";

export const getFieldType = props => {
  switch (props.field.field_type) {
    case "text":
      return Text(props);
    case "bool":
      return Bool(props);
    case "integer":
      return Number(props);
    case "file":
      return File(props);
    case "attachment":
      return Attachment(props);
    case "list":
      return List(props);
    case "date":
      return Date(props);
    case "checkbox":
      return Checkbox(props);
    case "email":
      return Email(props);
    case "phone":
      return Phone(props);
    case "paragraph":
      return Paragraph(props);
    case "break":
      return Break(props);
    case "divider":
      return Divider(props);
    case "select":
      return Select(props);
    case "url":
      return URL(props);

    default:
      return Text(props);
  }
};
