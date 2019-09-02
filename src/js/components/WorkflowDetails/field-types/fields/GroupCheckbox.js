import React, { Component } from "react";
import { Form, Checkbox as AntCheckbox, Divider } from "antd";
import { groupBy } from "lodash";
import { commonFunctions } from "../commons";
import PropTypes from "prop-types";

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

export class GroupedCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: this.props.field.answers[0]
        ? stringToArray(this.props.field.answers[0])
        : []
    };
    this.onChecked.bind(this);
  }

  onChecked = val => {
    this.setState({ selectedValues: val }, () => {
      onFieldChangeArray(this.props, val);
    });
  };

  componentDidUpdate = prevProps => {
    const updatedAnswer = stringToArray(this.props.field.answers[0]);
    if (prevProps.field.answers[0] !== this.props.field.answers[0]) {
      this.setState({ selectedValues: updatedAnswer });
    }
  };

  render = () => {
    const { props } = this;
    const { selectedValues } = this.state;
    const options = convertValueToString(getExtra(props)) || [];
    const isToBeGrouped = options.length && options[0].parent;
    const alertGroups = isToBeGrouped
      ? groupBy(options, b => {
          return b.parent;
        })
      : null;

    return (
      <FormItem
        label={getLabel(props, this)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        hasFeedback
        {...field_error(props)}
      >
        {alertGroups &&
          Object.keys(alertGroups).map(key => {
            return (
              <div key={`${key}`}>
                <div className="text-bold text-grey t-16">{key}</div>
                <div className="mr-bottom-lg">
                  <CheckboxGroup
                    disabled={isDisabled(props)}
                    style={{ width: "100%" }}
                    options={alertGroups[key]}
                    key={`${key}`}
                    onChange={val => {
                      this.onChecked(val);
                    }}
                    value={selectedValues}
                    {...feedValue(props)}
                  />
                </div>
                <Divider />
              </div>
            );
          })}
      </FormItem>
    );
  };
}

export const GroupCheckbox = props => {
  return <GroupedCheckbox {...props} />;
};

GroupCheckbox.propTypes = {
  workflowId: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
  currentStepFields: PropTypes.object,
  addComment: PropTypes.func.isRequired,
  changeFlag: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired
};
