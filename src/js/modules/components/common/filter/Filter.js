import React, { Component } from "react";

import FilterPopup from "./FilterPopup";

class Filter extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  render() {
    const { visible } = this.state;

    return (
      <div style={{ marginTop: 30 }}>
        <ul style={{ listStyle: "none" }}>
          <li onClick={() => this.showModal()} style={{ color: "#C2C2C2" }}>
            filter
          </li>
        </ul>
        {visible && (
          <FilterPopup handleCancel={this.handleCancel} visible={visible} />
        )}
      </div>
    );
  }
}

export default Filter;
