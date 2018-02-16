import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import logo from "../../images/client-logo/mck.png";

const { Header } = Layout;

class NavTop extends Component {
  render() {
    return (
      <div className="container navbar-top" id="navbar-top">
        <Header
          className="ant-nav"
          style={{
            background: "#fff",
            position: "fixed",
            width: "100%",
            left: 0,
            zIndex: 1,
            boxShadow: "0 1px 4px 0 rgba(0,0,0,0.09)"
          }}
        >
          <span className="logo" style={{ float: "left" }}>
            <img alt="mckinsey logo" src={logo} height="60" />
          </span>
          <Menu
            theme="light"
            mode="horizontal"
            style={{ lineHeight: "64px", float: "right" }}
          >
            <Menu.Item key="1">
              Create New <Icon type="plus" />
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="notification" />
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="area-chart" />
            </Menu.Item>
          </Menu>
        </Header>
      </div>
    );
  }
}

export default () => <NavTop />;
