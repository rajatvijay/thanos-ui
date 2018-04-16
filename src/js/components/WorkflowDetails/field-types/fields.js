import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Radio, InputNumber } from "antd";
import _ from "lodash";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// export const FieldType = {
//   Text,
//   //boolean,
//   //choice,
// };

export const getLabel = props => {
  if (!props.is_required) {
    return props.body;
  } else {
    return (
      <div className="clearfix">
        <span className="float-right small text-light">required</span>{" "}
        {props.body}
      </div>
    );
  }
};

//Field Type Text
export const Text = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.id}
      message="dfsdf"
      required={props.is_required}
      help={props.help_text}
      validateStatus={props.completed_at ? "success" : null}
    >
      <Input defaultValue={props.answers[0].answer} />
    </FormItem>
  );
};

//Field Type Boolean
export const Bool = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.id}
      message="dfsdf"
      required={props.is_required}
      help={props.help_text}
      validateStatus={props.completed_at ? "success" : null}
    >
      <RadioGroup>
        <Radio value={1}>Yes</Radio>
        <Radio value={2}>No</Radio>
      </RadioGroup>
    </FormItem>
  );
};

//Field Type Number
export const Number = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.id}
      message="dfsdf"
      required={props.is_required}
      help={props.help_text}
      validateStatus={props.completed_at ? "success" : null}
    >
      <InputNumber min={1} defaultValue={3} />
    </FormItem>
  );
};
