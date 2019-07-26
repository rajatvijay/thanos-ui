import React from "react";
import validator from "validator";
import { commonFunctions } from "./commons";
import { Icon, Form, Input } from "antd";
import _ from "lodash";

const FormItem = Form.Item;

const { getLabel, field_error, isDisabled } = commonFunctions;

//Field Type S3 Objects
class S3URL extends React.Component {
  state = {
    isValidURL: null
  };

  onChangeValidate = e => {
    const valid = validator.isURL(e.target.value);
    this.setState({ isValidURL: valid });
    if (valid) {
      this.props.onFieldChange(e, this.props);
    }
  };

  fieldError = () => {
    const ferr = field_error(this.props);

    if (this.state.isValidURL === false) {
      return {
        help: "Invalid URL",
        validateStatus: "error"
      };
    } else {
      return ferr;
    }
  };

  feedValue = () => {
    var opts = {};
    if (this.props.field.definition.disabled) {
      opts["value"] = _.size(this.props.field.answers)
        ? this.props.field.answers[0].attachment
        : this.props.field.definition.defaultValue;
    }
    return opts;
  };

  getFieldValue = () => {
    return this.props.field.answers[0]
      ? this.props.field.answers[0].attachment
      : this.props.field.definition.defaultValue;
  };

  render() {
    const props = this.props;
    const fieldValue = this.getFieldValue();
    return (
      <FormItem
        label={getLabel(props, this)}
        className="form-label"
        key={props.field.id}
        hasFeedback
        {...this.fieldError(props)}
      >
        {!props.completed ? (
          <Input
            disabled={isDisabled(props)}
            placeholder={props.field.placeholder}
            prefix={<Icon type="global" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="url"
            autoComplete="new-password"
            message="The input is not valid URL"
            onChange={this.onChangeValidate}
            value={fieldValue}
            onBlur={this.onChangeValidate}
            {...this.feedValue(props)}
          />
        ) : (
          <span>
            <span className="ant-input-affix-wrapper">
              <span className="ant-input-prefix">
                <i
                  className="anticon anticon-global"
                  style={{ color: "rgba(0, 0, 0, 0.25)" }}
                />
              </span>
              <div className="ant-input ant-input-disabled url-field">
                <a href={fieldValue}>{fieldValue}</a>
              </div>
            </span>
          </span>
        )}
      </FormItem>
    );
  }
}

export default S3URL;
