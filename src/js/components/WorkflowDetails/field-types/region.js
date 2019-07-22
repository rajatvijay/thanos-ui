import React, { Component } from "react";
import { authHeader } from "../../../_helpers";
import { Form, Select as AntSelect, Row, Col } from "antd";
import _ from "lodash";
import { workflowStepActions } from "../../../actions";
import { commonFunctions } from "./commons";
import validator from "validator";
import { apiBaseURL } from "../../../../config";

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
  getLink
} = commonFunctions;

class Reg extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false
    };
  }

  componentDidMount = () => {
    this.getRegionData();
  };

  getRegionData = () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    fetch(apiBaseURL + "fields/export-region-json/", requestOptions)
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
          const sortedResults = body.results.sort((a, b) =>
            a.label > b.label ? 1 : -1
          );
          this.setState({ data: sortedResults, loading: false });
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
    let that = this;
    return (
      <FormItem
        label={getLabel(props, that)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        message=""
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
      </FormItem>
    );
  };
}

//Field Type Select
export const Region = props => {
  return <Reg {...props} />;
};
