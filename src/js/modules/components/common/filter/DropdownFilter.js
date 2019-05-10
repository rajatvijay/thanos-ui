import React, { Component } from "react";
import { Select } from "antd";

const Option = Select.Option;

class DropdownFilter extends Component {
  renderOptions = () => {
    const { data } = this.props;
    return data.map(item => <Option value={item.value}>{item.label}</Option>);
  };

  render() {
    const { name, onFilterChange, value, placeholder } = this.props;

    return (
      <Select
        value={value}
        placeholder={placeholder}
        style={{ display: "block", margin: "20px 0px" }}
        onChange={select => onFilterChange(name, select)}
      >
        {this.renderOptions()}
      </Select>
    );
  }
}

export default DropdownFilter;
