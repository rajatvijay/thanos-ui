import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Button,
  Dropdown,
  Badge,
  Popover,
  List,
  Avatar
} from "antd";
import { configActions, logout } from "../../actions";
import logo from "../../../images/client-logo/dnb_logo.png";
import { connect } from "react-redux";
import _ from "lodash";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const content = (
  <div className="" style={{ maxWidth: "300px", maxHeight: "500px" }}>
    <List itemLayout="vertical" size="small">
      <List.Item key="1">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Data pull for Step</a>}
          description="'Detailed Company Profile' was initiated by Vetted Bot"
        />
        <div className="text-right text-light small">4 days ago</div>
      </List.Item>

      <List.Item key="2">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step:</a>}
          description="'D&B Select Company' was completed by palak abrol"
        />
        <div className="text-right text-light small">4 days ago</div>
      </List.Item>

      <List.Item key="3">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step</a>}
          description="' Adverse Media' was initiated by Vetted Bot"
        />
        <div className="text-right text-light small">1 week ago</div>
      </List.Item>

      <List.Item key="4">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step</a>}
          description="'' Adverse Media' was completed by VETTED bot as value of no. of hits is '0' which is equals to '0' "
        />
        <div className="text-right text-light small">1 week ago</div>
      </List.Item>

      <List.Item key="5">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step</a>}
          description="' Prohibited List Check' was completed by palak abrol"
        />
        <div className="text-right text-light small">1 week ago</div>
      </List.Item>
    </List>
  </div>
);

class NavTop extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.dispatch(configActions.getConfig());
  };

  onLogout(key) {
    this.props.dispatch(logout());
  }

  render = () => {
    let that = this;
    let user = this.props.authentication.user;

    return (
      <div>
        <div className="container navbar-top" id="navbar-top">
          <Header
            className="ant-nav"
            style={{
              background: "#fff",
              position: "fixed",
              width: "100%",
              left: 0,
              zIndex: 2,
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.09)"
            }}
          >
            <span className="logo" style={{ float: "left" }}>
              <a href="/">
                {!this.props.config.loading && this.props.config.logo ? (
                  <img
                    alt={this.props.config.name}
                    src={this.props.config.logo}
                  />
                ) : (
                  <img alt={this.props.config.name} src={logo} />
                )}
              </a>
            </span>

            <Menu
              theme="light"
              mode="horizontal"
              style={{ lineHeight: "64px", float: "right" }}
            >
              <Menu.Item key="2">
                <Popover
                  placement="bottomRight"
                  title={"Notifications"}
                  content={content}
                  trigger="click"
                >
                  <Badge count={5}>
                    <i className="material-icons text-base text-middle">
                      notifications
                    </i>
                  </Badge>
                </Popover>
              </Menu.Item>

              <SubMenu
                title={
                  <span>
                    <Avatar>{user.first_name.charAt(0)}</Avatar>
                  </span>
                }
                onClick={this.onLogout.bind(this, "key")}
              >
                <Menu.Item key="setting:2" disabled>
                  Profile
                </Menu.Item>
                <Menu.Item key="setting:1">Logout</Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { workflowKind, authentication, config } = state;
  return {
    workflowKind,
    authentication,
    config
  };
}

export default connect(mapStateToProps)(NavTop);
