import React from "react";
import { Form, Checkbox as AntCheckbox } from "antd";
import _ from "lodash";
import { commonFunctions } from "../commons";

const FormItem = Form.Item;

//Common utility fucntions bundled in one file commons.js//
const {
  getLabel,
  getExtra,
  onFieldChangeArray,
  stringToArray,
  field_error,
  feedValue,
  isDisabled,
  convertValueToString
} = commonFunctions;

//Field Type Checkbox
const CheckboxGroup = AntCheckbox.Group;

export const Checkbox = props => {
  const defVal = [{ label: "Yes", value: "true" }];
  const options = convertValueToString(getExtra(props)) || [];

  return (
    <FormItem
      label={getLabel(props, this)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      hasFeedback
      {...field_error(props)}
    >
      <CheckboxGroup
        disabled={isDisabled(props)}
        style={{ width: "100%" }}
        options={!_.isEmpty(options) ? options : defVal}
        onChange={onFieldChangeArray.bind(this, props)}
        defaultValue={
          props.field.answers[0]
            ? stringToArray(props.field.answers[0])
            : props.field.definition.defaultValue
        }
        {...feedValue(props)}
      />
    </FormItem>
  );
};
