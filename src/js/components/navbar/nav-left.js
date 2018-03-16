import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";

const { Sider } = Layout;

class NavLeft extends Component {
  render() {
    return (
      <div className="" id="">
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: "65px"
          }}
          collapsed={true}
        >
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
            <Menu.Item key="1">
              <Link to="/workflows/instances" className="nav-text">
                <Icon type="switcher" />
                <span className="nav-text">WorkFlows</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="2">
              <Link to="/users" className="nav-text">
                <Icon type="user" />
                <span className="nav-text">People</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/insight">
                <Icon type="line-chart" />
                <span className="nav-text">Insight</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="4">
              <Link to="/login" className="nav-text">
                <Icon type="logout" />
                <span className="nav-text">Logout</span>
              </Link>
            </Menu.Item>


          </Menu>
        </Sider>
      </div>
    );
  }
}

export default () => <NavLeft />;
