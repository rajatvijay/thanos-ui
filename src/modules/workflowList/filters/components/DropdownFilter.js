import React, { Component } from "react";
import { Select } from "antd";
// import { css } from "emotion";

const Option = Select.Option;

class DropdownFilter extends Component {
  renderOptions = () => {
    const { data } = this.props;
    return Array.isArray(data) ? this.makeOptionsCmp(data) : null;
  };

  makeOptionsCmp = data => {
    return data.map((item, index) => (
      <Option key={`option_${index}`} value={item.value}>
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

  render() {
    const {
      style = {},
      data, // Extacting out data, since it should not be a part of the restProps
      searchable,
      ...restProps
    } = this.props;

    const searchProps = searchable ? this.searchProps : {};

    return (
      <Select
        style={{
          display: "block",
          margin: "20px 0px",
          width: "100%",
          marginRight: "40px",
          ...style
        }}
        // TODO: Check if this is required
        // className={css`
        //   .ant-select-selection__rendered {
        //     margin-left: 0;
        //   }
        // `}
        {...restProps}
        {...searchProps}
      >
        {this.renderOptions()}
      </Select>
    );
  }
}

export default DropdownFilter;
