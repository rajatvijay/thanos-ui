import React, { Component } from "react";

import { Input } from "antd";

export default class InputBox extends Component {
  render() {
    const { name, value, onChange, ...restProps } = this.props;

    return <Input onChange={this.onChange} {...restProps} />;
  }
}
