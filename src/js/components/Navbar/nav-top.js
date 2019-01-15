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
  Select,
  Drawer,
  Tooltip
} from "antd";
import { logout, workflowActions, languageActions } from "../../actions";
//import logo from "../../../images/client-logo/dnb_logo.png";
import { connect } from "react-redux";
import _ from "lodash";
import { authHeader, baseUrl } from "../../_helpers";
import SelectLanguage from "../SelectLanguage";
import { FormattedMessage, injectIntl } from "react-intl";
import MetaGraph from "../Workflow/MetaGraph";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Search = Input.Search;
const Option = Select.Option;

class NavTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      showInsights: false
    };
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

  onSearchChange = e => {
    this.setState({ searchInput: e.target.value });
  };

  emitEmpty = () => {
    this.searchInput.focus();
    this.setState({ searchInput: "" });
    this.props.dispatch(workflowActions.getAll());
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.onSearch(this.state.searchInput);
    }
  };

  showDrawer = () => {
    this.setState({
      showInsights: true
    });
  };

  hideDrawer = () => {
    this.setState({
      showInsights: false
    });
  };

  render = () => {
    console.log(this.props, "navbar Language");
    let that = this;
    let user = this.props.authentication.user;
    const { searchInput } = this.state;
    const suffix = searchInput ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;
    const prefix = (
      <Icon
        type="search"
        onClick={() => this.onSearch(searchInput)}
        className="text-anchor"
        style={{ color: "rgba(0,0,0,.25)" }}
      />
    );

    let showInsights = true;
    if (user && _.includes(user.features, "view_reports")) {
      showInsights = true;
    }

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
                    <Input
                      prefix={prefix}
                      suffix={suffix}
                      value={searchInput}
                      placeholder={this.props.intl.formatMessage({
                        id: "commonTextInstances.search"
                      })}
                      onChange={this.onSearchChange}
                      ref={node => (this.searchInput = node)}
                      onKeyPress={this.handleKeyPress}
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
                  selectable={false}
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
                     </Menu.Item>*/}
                  {showInsights ? (
                    <Menu.Item key="2">
                      <Tooltip title={"Insight"} placement={"bottom"}>
                        <span className="pd-ard-sm" onClick={this.showDrawer}>
                          <i className="material-icons text-light text-anchor t-18 ">
                            trending_up
                          </i>
                        </span>
                      </Tooltip>
                    </Menu.Item>
                  ) : null}

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
          <Drawer
            width={600}
            title="Insight"
            placement="right"
            closable={false}
            onClose={this.hideDrawer}
            visible={this.state.showInsights}
          >
            <MetaGraph />
          </Drawer>
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

export default connect(mapStateToProps)(injectIntl(NavTop));
