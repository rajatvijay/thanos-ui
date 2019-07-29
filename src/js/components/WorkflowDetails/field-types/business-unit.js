import React, { Component } from "react";
import { authHeader } from "../../../_helpers";
import { Form, Select as AntSelect } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { APIFetch } from "../../../utils/request";

const FormItem = Form.Item;
const Option = AntSelect.Option;

const { getLabel, onFieldChange, stringToArray, field_error } = commonFunctions;

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

    APIFetch("fields/export-business-json/", requestOptions)
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
          const data = _.orderBy(body.results, ["label"], ["asc"]);
          this.setState({ data: data, loading: false });
        }
      });
  };

  render = () => {
    const props = this.props;
    const single = true;
    const save = onFieldChange.bind(this, props);
    const that = this;

    return (
      <FormItem
        label={getLabel(props, that)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        message=""
        validateStatus={this.state.loading ? "validating" : ""}
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
              <Option key={`option_${index}`} value={item.value}>
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
export const BusinessUnit = props => {
  return <BU {...props} />;
};
