import React, { Component } from "react";
import { Select } from "antd";

const { Option } = Select;

class FilterDropdown extends Component {
  renderOptions = () => {
    const { data } = this.props;
    return Array.isArray(data) ? this.makeOptionsCmp(data) : null;
  };

  makeOptionsCmp = data => {
    return data.map(item => (
      <Option key={item.value} value={item.value} data-item={item}>
        {item.label}
      </Option>
    ));
  };

  get searchProps() {
    // Just adding some props to make our select component searchable
    return {
      showSearch: true,
      optionFilterProp: "children",
      filterOption: (input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
  }

  handleSelect = (value, option) => {
    // Extracting out the actual item obj and sending it to the parent callback
    const item = option.props["data-item"];
    this.props.onSelect(value, item);
  };

  render() {
    const {
      // data, // Extacting out data, since it should not be a part of the restProps
      searchable,
      // onSelect, // Extracting this out, since we want to override this
      ...restProps
    } = this.props;

    const searchProps = searchable ? this.searchProps : {};

    return (
      <Select {...restProps} {...searchProps} onSelect={this.handleSelect}>
        {this.renderOptions()}
      </Select>
    );
  }
}

export default FilterDropdown;
