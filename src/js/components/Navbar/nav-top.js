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
  Col,
  Select
} from "antd";
import { logout, workflowActions, languageActions } from "../../actions";
//import logo from "../../../images/client-logo/dnb_logo.png";
import { connect } from "react-redux";
import _ from "lodash";
import { authHeader, baseUrl } from "../../_helpers";
import SelectLanguage from "../SelectLanguage";

import { FormattedMessage } from "react-intl";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Search = Input.Search;
const Option = Select.Option;

class NavTop extends Component {
  constructor(props) {
    super(props);
  }

  onLogout(key) {
    this.props.dispatch(logout());
  }

  onSearch = e => {
    if (e) {
      this.props.dispatch(workflowActions.searchWorkflow(e));
    } else {
      this.props.dispatch(workflowActions.getAll());
    }
  };
  handleChange = value => {
    this.props.dispatch(languageActions.updateUserLanguage(value));
  };

  render = () => {
    console.log(this.props, "navbar Language");
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

                {document.location.pathname.match("/workflows/instances/") ? (
                  <div className={"search-box "}>
                    <Search
                      placeholder="Search"
                      onSearch={value => this.onSearch(value)}
                      // prefix={
                      //   <Icon
                      //     type="search"
                      //     style={{ color: "rgba(0,0,0,.25)" }}
                      //   />
                      // }
                      style={{ width: 300 }}
                    />
                  </div>
                ) : null}
              </Col>
              <Col span={12}>
                <SelectLanguage navbar={true} />
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
                      user ? (
                        <span>
                          {user.first_name ? (
                            <Avatar>{user.first_name.charAt(0)}</Avatar>
                          ) : (
                            <Avatar icon="user" />
                          )}
                          {user.first_name
                            ? " " + user.first_name + " " + user.last_name + " "
                            : " " + user.email + " "}
                          <i className="material-icons t-14">
                            keyboard_arrow_down
                          </i>
                        </span>
                      ) : null
                    }
                    onClick={this.onLogout.bind(this, "key")}
                  >
                    <Menu.Item key="setting:1">
                      <FormattedMessage id="loginPageInstances.logoutText" />
                    </Menu.Item>
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
  const { workflowKind, authentication, config, languageSelector } = state;
  return {
    workflowKind,
    authentication,
    config,
    languageSelector
  };
}

export default connect(mapStateToProps)(NavTop);
