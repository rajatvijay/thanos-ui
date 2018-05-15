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
  if (!props.field.is_required) {
    return props.field.body;
  } else {
    return (
      <div className="clearfix">
        <span className="float-right small text-light">required</span>{" "}
        {props.field.body}
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
      key={props.field.id}
      message=""
      required={props.field.is_required}
      help={props.field.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <Input
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.defaultValue
        }
        onChange={e => props.onFieldChange(e, props)}
      />
    </FormItem>
  );
};

//Field Type Boolean
export const Bool = props => {
  let defVal =
    props.field.answers !== null
      ? props.field.answers[0].answer
      : props.field.defaultValue ? 1 : 2;

  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message="dfsdf"
      required={props.field.is_required}
      help={props.field.help_text}
      validateStatus={props.field.completed_at ? "success" : null}
    >
      <RadioGroup
        onChange={e => props.onFieldChange(e, props)}
        defaultValue={parseInt(defVal)}
      >
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
      key={props.field.id}
      message="dfsdf"
      required={props.field.is_required}
      help={props.field.help_text}
      validateStatus={props.field.completed_at ? "success" : null}
    >
      <InputNumber min={1} defaultValue={3} />
    </FormItem>
  );
};
