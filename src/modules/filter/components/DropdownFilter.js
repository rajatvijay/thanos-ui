import React, { Component } from "react";
import { Select } from "antd";
import { css } from "emotion";

const Option = Select.Option;

class DropdownFilter extends Component {
  renderOptions = () => {
    const { data } = this.props;
    return Array.isArray(data)
      ? data.map((item, index) => (
          <Option key={`option_${index}`} value={item.value}>
            {item.label}
          </Option>
        ))
      : null;
  };

  get searchableProps() {
    // Just adding some props to make our select component searchable
    return {
      showSearch: true,
      optionFilterProp: "children",
      filterOption: (input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
  }

  render() {
    const {
      name,
      onFilterChange,
      value,
      placeholder,
      loading = false,
      searchable
    } = this.props;

    const additionalProps = searchable ? this.searchableProps : {};

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
        {...additionalProps}
      >
        {this.renderOptions()}
      </Select>
    );
  }
}

export default DropdownFilter;
