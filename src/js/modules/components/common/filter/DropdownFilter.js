import React, { Component } from "react";
import { Menu, Dropdown, Icon, Select } from "antd";

const Option = Select.Option;

export default class DropdownFilter extends Component {
  renderMenu = () => {
    const { data } = this.props;
    console.log(data)

    return data.map(item => <Option value={item.value}>{item.label}</Option>);
  };

  render() {
    const { name, onFilterChange, value, placeholder } = this.props;

    return (
      // <Dropdown overlay={this.renderMenu} trigger={['click']}>
      <Select
      //defaultValue={value}
        value={value}
        placeholder={placeholder}
        style={{ display: "block", margin: "20px 0px" }}
        onChange={select => onFilterChange(name, select)}
      >
        {this.renderMenu()}
      </Select>
      // {/* <div
      // style={{borderBottom: "1px solid",
      //   display: "flex",
      //   justifyContent: "space-between",
      //   margin:"30px 0px"
      // }}
      // className="ant-dropdown-link">
      // <span >
      // {name}

      // </span>
      // <Icon type="down" />
      // </div> */}

      //   {/* </Dropdown> */}
    );
  }
}
