import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import { connect } from "react-redux";
import { logout } from "../../actions";
import { history } from "../../_helpers";
import _ from "lodash";

const { Sider } = Layout;

const menuList = [
  { name: "Workflows", path: "/workflows/instances", icon: "switcher" },
  { name: "Users", path: "/users", icon: "user" },
  { name: "Insight", path: "/insight", icon: "line-chart" }
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
    } else if (url.includes("/insight")) {
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
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[this.state.activePath]}
          >
            {_.map(menuList, function(m, index) {
              return (
                <Menu.Item key={index}>
                  <Link to={m.path} className="nav-text">
                    <Icon type={m.icon} />
                    <span className="nav-text">{m.name}</span>
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu>

          <br />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={["5"]}
            style={{ position: "absolute", bottom: "61px" }}
            onClick={this.onLogout.bind(this, "key")}
          >
            <Menu.Item key="5">
              <Icon type="logout" />
              <span className="nav-text">Logout</span>
            </Menu.Item>
          </Menu>
        </Sider>
      </div>
    );
  }
}

export default connect(null)(NavLeft);
