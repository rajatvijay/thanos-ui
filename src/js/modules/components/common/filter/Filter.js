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
        <ul
          style={{
            listStyle: "none",
            fontSize: 14,
            color: "#000",
            cursor: "pointer"
          }}
        >
          <li
            style={{
              display: "inline",
              paddingRight: 10
            }}
          >
            DATE CREATED
          </li>
          <li
            onClick={() => this.showModal()}
            style={{
              display: "inline",
              paddingRight: 10
            }}
          >
            FILTER
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
