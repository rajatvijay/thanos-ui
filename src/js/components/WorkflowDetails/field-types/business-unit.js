import React, { Component } from "react";
import { authHeader, baseUrl } from "../../../_helpers";
import { Form, Select as AntSelect, Row, Col } from "antd";
import _ from "lodash";
import { workflowStepActions } from "../../../actions";
import { commonFunctions } from "./commons";
import validator from "validator";

const FormItem = Form.Item;
const Option = AntSelect.Option;

const {
  getLabel,
  onFieldChange,
  onFieldChangeArray,
  arrayToString,
  stringToArray,
  field_error,
  getRequired,
  feedValue,
  addComment,
  addCommentBtn,
  getLink
} = commonFunctions;

class BU extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false
    };
  }

  componentDidMount = () => {
    this.getBusinessUnitList();
  };

  getBusinessUnitList = () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    fetch(baseUrl + "fields/export-business-json/", requestOptions)
      .then(response => response.json())
      .then(body => {
        if (_.isEmpty(body.results)) {
          this.setState({
            data: [
              { label: "list empty", value: "list empty", disabled: true }
            ],
            loading: false
          });
        } else {
          this.setState({ data: body.results, loading: false });
        }
      });
  };

  render = () => {
    const props = this.props;
    let single = true;
    //            props.field.definition.field_type === "single_select" ? true : false;
    let save = onFieldChange.bind(this, props);

    // if (!single) {
    //     save = onFieldChangeArray.bind(this, props);
    // }

    return (
      <FormItem
        label={getLabel(props)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        message=""
        required={getRequired(props)}
        validateStatus={this.state.loading ? "validating" : null}
        hasFeedback
        {...field_error(props)}
      >
        <AntSelect
          allowClear
          mode={single ? "default" : "multiple"}
          disabled={
            props.completed ||
            props.is_locked ||
            props.field.definition.disabled
          }
          defaultValue={
            props.field.answers[0]
              ? props.field.answers[0].answer
              : stringToArray(props.field.definition.defaultValue)
          }
          onChange={save}
          showSearch={true}
        >
          {_.map(this.state.data, function(item, index) {
            return (
              <Option key={index} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </AntSelect>
        {addCommentBtn(this, props)}
      </FormItem>
    );
  };
}

//Field Type Select
export const BusinessUnit = props => {
  return <BU {...props} />;
};
