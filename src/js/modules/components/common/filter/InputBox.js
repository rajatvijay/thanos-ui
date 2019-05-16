import React, { Component } from "react";

import { Input } from "antd";

export default class InputBox extends Component {
  onChange = e => {
    console.log(e);
  };

  render() {
    const { name, onFilterChange, placeholder, value } = this.props;

    return <Input onChange={this.onChange} />;
  }
}