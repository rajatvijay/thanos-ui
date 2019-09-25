import React, { Component } from "react";
import { Form, Input } from "antd";
import { commonFunctions } from "../../../js/components/WorkflowDetails/field-types/commons";
import _ from "lodash";
import { supportedFieldFormats } from "../../../config";
import FormattedTextInput from "../../common/components/FormattedTextInput";

const { TextArea } = Input;
const FormItem = Form.Item;

const { getLabel, field_error, getStyle, isDisabled } = commonFunctions;

export class Text extends Component {
  state = {
    inputText: this.props.decryptedData
      ? this.props.decryptedData.answer
      : this.props.field.answers[0]
      ? this.props.field.answers[0].answer
      : this.props.field.definition.defaultValue
  };

  get format() {
    // TODO:
    // The condition below must be removed as soon as we are getting
    // definition.extra.format === "duns"
    if (
      /d-u-n-s\snumber/i.test(_.get(this.props, "field.definition.body", null))
    )
      return supportedFieldFormats.duns;
    return supportedFieldFormats[
      _.get(this.props, "field.definition.extra.format", null)
    ];
  }

  get initialAnswer() {
    /**
     * Returns the first answer that was present for this field
     */
    return this.props.field.answers[0];
  }

  answerFromProps = props => {
    return props.decryptedData
      ? props.decryptedData.answer
      : props.field.answers[0]
      ? props.field.answers[0].answer
      : props.field.definition.defaultValue;
  };

  componentDidUpdate(prevProps) {
    const inputText = this.answerFromProps(this.props);
    const prevInputText = this.answerFromProps(prevProps);

    if (inputText !== prevInputText) {
      this.setState({ inputText });
    }
  }

  onChange = e => {
    const { value } = e.target;
    this.setState({ inputText: value });
    this.props.validateAnswer(this.props.field, value);
  };

  onBlur = e => {
    const { value } = e.target;
    const error = this.props.error[this.props.field.id];
    if (this.initialAnswer && value === this.initialAnswer.answer) {
      return;
    }

    if (value === "" && this.initialAnswer) {
      this.props.clearResponse({
        responseId: this.initialAnswer.id,
        field: this.props.field,
        workflowId: this.props.workflowId
      });
    } else if (!error) {
      this.props.saveResponse({
        answer: value,
        field: this.props.field,
        workflowId: this.props.workflowId
      });
    }
  };

  get inputProps() {
    const { props } = this;
    let rows = _.get(props, "field.definition.meta.height", 1);

    let fieldProps = {
      disabled: isDisabled(props),
      autosize: { minRows: rows },
      placeholder: props.field.placeholder,
      value: this.state.inputText,
      autoComplete: "new-password",
      onChange: this.onChange,
      onBlur: this.onBlur,
      style: getStyle(props)
    };

    if (this.format) fieldProps.format = this.format;

    return fieldProps;
  }

  render() {
    const { props } = this;

    let TextFieldComponent = this.format ? FormattedTextInput : TextArea;

    return (
      <FormItem
        label={getLabel(props, this)}
        className={
          "from-label " + (_.size(props.field.selected_flag) ? " has-flag" : "")
        }
        style={{ display: "block" }}
        key={props.field.id}
        message=""
        hasFeedback
        autoComplete="new-password"
        {...field_error(props)}
      >
        <TextFieldComponent {...this.inputProps} />
      </FormItem>
    );
  }
}
