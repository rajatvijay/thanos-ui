import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Button,
  Input,
  Dropdown,
  Badge,
  Popover,
  List,
  Avatar,
  Row,
  Col
} from "antd";
import { logout } from "../../actions";
//import logo from "../../../images/client-logo/dnb_logo.png";
import { connect } from "react-redux";
import _ from "lodash";
import { authHeader, baseUrl } from "../../_helpers";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class NavTop extends Component {
  constructor(props) {
    super(props);
  }

  onLogout(key) {
    this.props.dispatch(logout());
  }

  render = () => {
    let that = this;
    let user = this.props.authentication.user;

    return (
      <div>
        <div className="container navbar-top" id="navbar-top">
          <Header className="ant-nav">
            <Row>
              {/*logo wrapper*/}
              <Col span={12}>
                <span className="logo" style={{ float: "left" }}>
                  <a href="/">
                    {!this.props.config.loading && this.props.config.logo ? (
                      <img
                        alt={this.props.config.name}
                        src={this.props.config.logo}
                      />
                    ) : !this.props.config.loading ? (
                      <h3>{this.props.config.name}</h3>
                    ) : (
                      <h3>{authHeader.getClient()}</h3>
                    )}
                  </a>
                </span>

                <div className="search-box">
                  <Input
                    placeholder="Search for workflow"
                    prefix={
                      <Icon
                        type="search"
                        style={{ color: "rgba(0,0,0,.25)" }}
                      />
                    }
                    //suffix={suffix}
                    //value={userName}
                    //onChange={this.onChangeUserName}
                    //ref={node => this.userNameInput = node}
                  />
                </div>
              </Col>
              <Col span={12}>
                <Menu
                  theme="light"
                  mode="horizontal"
                  style={{ lineHeight: "62px", float: "right" }}
                >
                  {/* <Menu.Item key="2">
                       <Popover
                         placement="bottomRight"
                         title={<span className="text-medium">Activity log</span>}
                         content={<AuditList />}
                         trigger="click"
                       >
                         <i className="material-icons text-grey text-middle">
                           restore
                         </i>
                       </Popover>
                     </Menu.Item>
                 */}
                  <SubMenu
                    title={
                      this.props.authentication.user ? (
                        <span>
                          <Avatar>{user.first_name.charAt(0)}</Avatar>{" "}
                          <i className="material-icons t-14">
                            keyboard_arrow_down
                          </i>
                        </span>
                      ) : null
                    }
                    onClick={this.onLogout.bind(this, "key")}
                  >
                    <Menu.Item key="setting:2" disabled>
                      Profile
                    </Menu.Item>
                    <Menu.Item key="setting:1">Logout</Menu.Item>
                  </SubMenu>
                </Menu>
              </Col>
            </Row>
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
