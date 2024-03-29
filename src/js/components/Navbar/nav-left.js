import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import { connect } from "react-redux";
import { logout } from "../../actions";
import { history } from "../../_helpers";
import _ from "lodash";

import { FormattedMessage } from "react-intl";

const { Sider } = Layout;

const menuList = [
  { name: "Workflows", path: "/workflows/instances", icon: "switcher" },
  { name: "People", path: "/users", icon: "user" },
  { name: "Export data", path: "/export-list", icon: "download" }
  //  { name: "Insight", path: "/insight", icon: "line-chart" }
  //{ name: "Logout", path: "/login", icon: "logout" }
];

class NavLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: "1"
    };
  }

  componentDidMount() {
    //change this once path is available with redux.
    this.onPathChange(history.location.pathname);
    history.listen((location, action) => {
      this.onPathChange(location.pathname);
    });
  }

  onPathChange(url) {
    let code = "0";

    if (url.includes("/workflows")) {
      code = "0";
    } else if (url.includes("/users")) {
      code = "1";
    } else if (url.includes("/export-list")) {
      code = "2";
    } else {
      code = "0";
    }
    this.setState({ activePath: code });
  }

  onLogout(key) {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <div className="navbar-left" id="">
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: "65px",
            width: "90px"
          }}
          width={"90px"}
          collapsedWidth={90}
          collapsed={true}
          className="bg-primary"
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[this.state.activePath]}
            className="bg-primary"
          >
            {_.map(menuList, function(m, index) {
              return (
                <Menu.Item key={index}>
                  <Link to={m.path} className="nav-text">
                    <div>
                      <Icon type={m.icon} />
                    </div>
                    <span className="nav-text-tooltip text-nounderline">
                      {m.name}
                    </span>
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu>

          <br />
          <Menu
            mode="inline"
            selectedKeys={["0"]}
            style={{ position: "absolute", bottom: "61px" }}
            onClick={this.onLogout.bind(this, "key")}
          >
            <Menu.Item key="5">
              <span className="nav-text">
                <div>
                  <Icon type="logout" />
                </div>
                <span className="nav-text">
                  <FormattedMessage id="loginPageInstances.logoutText" />
                </span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
      </div>
    );
  }
}

export default connect(null)(NavLeft);
