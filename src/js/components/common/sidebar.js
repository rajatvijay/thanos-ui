import React, { Component } from "react";
import { Icon } from "antd";

class Sidebar extends Component {
  constructor(props) {
    super();
  }

  callback = key => {};

  toggle = () => {
    this.props.toggleSidebar();
  };

  render() {
    return (
      <div
        className="profile-sidebar sidebar-right"
        style={{
          background: "#fff",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          zIndex: 2,
          right: 0,
          top: 65,
          width: 300,
          ...this.props.style
        }}
        collapsed={this.props.sidebar}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        trigger={null}
      >
        <div className="profile-details">
          <div className="sidebar-head">
            <span className="sidebar-title">{this.props.title}</span>
            <span className="close-trigger">
              <Icon
                className="trigger"
                type={this.props.sidebar ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
            </span>
          </div>
          {this.props.sidebar ? this.props.children : "..."}
        </div>
      </div>
    );
  }
}

export default Sidebar;
