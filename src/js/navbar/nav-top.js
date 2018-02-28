import React, { Component } from "react";
import { Layout, Menu, Icon, Button, Dropdown } from "antd";
import logo from "../../images/client-logo/mck.png";

const { Header } = Layout;

class NavTop extends Component {
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1" className="text-primary text-medium">
          <i className="material-icons t-14 pd-right-sm">receipt</i> Add a
          supplier or site
        </Menu.Item>
        <Menu.Item key="2" className="text-primary text-medium">
          <i className="material-icons t-14 pd-right-sm">star</i> Review
        </Menu.Item>
        <Menu.Item key="3" className="text-primary text-medium">
          <i className="material-icons t-14 pd-right-sm">person</i> Invite
          vendor
        </Menu.Item>
      </Menu>
    );

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
            <Menu.Item key="2">
              <Icon type="notification" />
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="area-chart" />
            </Menu.Item>
          </Menu>
          <span className="float-right">
            <Dropdown overlay={menu} placement="bottomRight">
              <Button type="primary" size="small">
                + Create <Icon type="down" />
              </Button>
            </Dropdown>
          </span>
        </Header>
      </div>
    );
  }
}

export default () => <NavTop />;
