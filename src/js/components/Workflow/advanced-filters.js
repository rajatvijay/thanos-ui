import React, { Component } from "react";
import { Button, Select, Input, Cascader, Form } from "antd";
import { baseUrl, authHeader } from "../../_helpers";
import { workflowFiltersActions } from "../../actions";
import _ from "lodash";

const FormItem = Form.Item;
const Option = Select.Option;

class WorkflowAdvFilter extends Component {
  state = {
    data: [],
    value: "",
    filterBuilder: { field: null, operator: null, value: null },
    filterList: [],
    fieldOptions: null,
    advFilterErr: false
  };

  handleChange = (type, value) => {
    let fb = this.state.filterBuilder;

    switch (type) {
      case "field":
        let fieldLast = value.length - 1;

        fb.field = value[fieldLast];
        break;
      case "operator":
        fb.operator = value;
        break;
      case "fieldValue":
        fb.value = value.target.value;
        break;
    }

    this.setState({ filterBuilder: fb }, function() {});
  };

  componentDidMount = () => {
    //convert  this to redux action and store to redux store
  };

  componentDidUpdate = prevProps => {
    if (prevProps.showAdvFilters !== this.props.showAdvFilters) {
      if (this.props.showAdvFilters) {
        const requestOptions = {
          method: "GET",
          headers: authHeader.get(),
          credentials: "include"
        };

        fetch(baseUrl + "fields/export-json/", requestOptions)
          .then(response => response.json())
          .then(body => {
            this.setState({ fieldOptions: body.results, fetching: false });
          });
      }
    }
  };

  onAddFilterItem = () => {
    let filterList = this.state.filterList;

    if (_.some(this.state.filterBuilder, _.isEmpty)) {
      this.setState({ advFilterErr: true });
    } else {
      filterList.push(this.state.filterBuilder);

      //dispatch filter code here

      this.setState({
        filterList: filterList,
        //filterBuilder: { field: null, operator: null, value: null },
        advFilterErr: false
      });
      this.props.form.resetFields();

      this.setFilter(filterList);
    }
  };

  setFilter = filterList => {
    let a = [];

    _.map(filterList, function(i) {
      let f = i.field + "__" + i.operator + "__" + i.value;
      a.push(f);
    });

    let payload = { filterType: "answer", filterValue: a };

    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  removeFilterItem = index => {
    let arr = this.state.filterList;
    arr.splice(index, 1);
    this.setState({ filterList: arr });
    this.setFilter(arr);
  };

  render = () => {
    let that = this;

    return (
      <Form>
        <div>
          <div>
            <FormItem
              hasFeedback={
                this.state.advFilterErr &&
                this.state.filterBuilder.field === null
                  ? true
                  : false
              }
              validateStatus={
                this.state.advFilterErr &&
                this.state.filterBuilder.field === null
                  ? "error"
                  : ""
              }
            >
              <Cascader
                options={this.state.fieldOptions}
                onChange={this.handleChange.bind(this, "field")}
                placeholder="Please select field"
              />
            </FormItem>

            <FormItem
              hasFeedback={
                this.state.advFilterErr &&
                this.state.filterBuilder.operator === null
                  ? true
                  : false
              }
              validateStatus={
                this.state.advFilterErr &&
                this.state.filterBuilder.operator === null
                  ? "error"
                  : ""
              }
            >
              <Select
                placeholder="select operator"
                style={{ width: "100%" }}
                onChange={this.handleChange.bind(this, "operator")}
              >
                <Option value="eq">Equal</Option>
                <Option value="not_eq">Not equal</Option>
                <Option value="is_set">Has value</Option>
                <Option value="contains">Contains</Option>
                <Option value="not_contains">Does not contain</Option>
              </Select>
            </FormItem>

            <FormItem
              hasFeedback={
                this.state.advFilterErr &&
                this.state.filterBuilder.value === null
                  ? true
                  : false
              }
              validateStatus={
                this.state.advFilterErr &&
                this.state.filterBuilder.value === null
                  ? "error"
                  : ""
              }
            >
              <Input
                placeholder="Input value"
                onChange={this.handleChange.bind(this, "fieldValue")}
              />
            </FormItem>
          </div>

          <Button
            type="primary"
            size="default"
            style={{ width: "100%" }}
            onClick={this.onAddFilterItem}
          >
            Add Filter
          </Button>

          <div className="adv-filter-list">
            {_.map(this.state.filterList, function(i, index) {
              return (
                <div
                  className="adv-filter-item"
                  key={index}
                  onClick={that.removeFilterItem.bind(that, index)}
                >
                  where <b>{i.field}</b> {i.operator} to <b>{i.value}</b>
                </div>
              );
            })}
          </div>
        </div>
      </Form>
    );
  };
}

export const WrappedAdvancedFilterForm = Form.create()(WorkflowAdvFilter);
