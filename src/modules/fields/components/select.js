import React, { Component } from "react";
import { Form, Select as AntSelect } from "antd";
import { commonFunctions } from "../../../js/components/WorkflowDetails/field-types/commons";

const FormItem = Form.Item;
const Option = AntSelect.Option;

const {
  getLabel,
  getExtra,
  arrayToString,
  stringToArray,
  field_error,
  getStyle,
  isDisabled
} = commonFunctions;

export class Select extends Component {
  get isSingleSelect() {
    return this.props.field.definition.field_type === "single_select";
  }

  get initialAnswer() {
    /**
     * Returns the first answer that was present for this field
     */
    return this.props.field.answers[0];
  }

  get initialAnswerValue() {
    const existingAnswer = this.initialAnswer;

    if (existingAnswer) {
      return this.isSingleSelect
        ? existingAnswer.answer
        : stringToArray(existingAnswer);
    } else {
      return stringToArray(this.props.field.definition.defaultValue);
    }
  }

  get selectType() {
    return this.isSingleSelect ? "default" : "multiple";
  }

  isBeingCleared = value => {
    /**
     * On clearing field,
     * For single-select, value is sent as undefined
     * For multi-select, value is sent as empty array
     */
    return this.initialAnswer && this.isSingleSelect
      ? value === undefined
      : value.length === 0;
  };

  onChange = (value, options) => {
    if (this.isBeingCleared(value)) {
      this.props.clearResponse({
        responseId: this.initialAnswer.id,
        field: this.props.field,
        workflowId: this.props.workflowId
      });
    } else {
      const answer = this.isSingleSelect ? value : arrayToString(value);
      this.props.saveResponse({
        answer,
        field: this.props.field,
        workflowId: this.props.workflowId
      });
    }
  };

  render() {
    const { props } = this;
    const options = getExtra(props) || [];

    return (
      <FormItem
        label={getLabel(this.props)}
        className="from-label"
        style={{ display: "block" }}
        key={this.props.field.id}
        message=""
        hasFeedback
        {...field_error(this.props)}
      >
        <AntSelect
          allowClear
          mode={this.selectType}
          style={getStyle(this.props)}
          disabled={isDisabled(this.props)}
          value={this.initialAnswerValue}
          onChange={this.onChange}
          showSearch={true}
          filterOption={(input, option) =>
            option.props.children
              .toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {options.length &&
            options.map(function(item, index) {
              return (
                <Option key={`${item.value}`} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
        </AntSelect>
      </FormItem>
    );
  }
}
