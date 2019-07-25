import React, { Component } from "react";
import { Select } from "antd";
import { css } from "emotion";

const Option = Select.Option;

class DropdownFilter extends Component {
  renderOptions = () => {
    const { data } = this.props;
    return Array.isArray(data)
      ? data.map(item => <Option value={item.value}>{item.label}</Option>)
      : null;
  };

  render() {
    const {
      name,
      onFilterChange,
      value,
      placeholder,
      loading = false
    } = this.props;

    return (
      <Select
        loading={!!loading}
        value={value}
        placeholder={placeholder}
        style={{ display: "block", margin: "20px 0px" }}
        onChange={select => onFilterChange(name, select)}
        className={css`
          .ant-select-selection__rendered {
            margin-left: 0;
          }
        `}
      >
        {this.renderOptions()}
      </Select>
    );
  }
}

export default DropdownFilter;
