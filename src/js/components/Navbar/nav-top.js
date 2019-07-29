import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Input,
  Row,
  Col,
  Drawer,
  Tooltip,
  notification
} from "antd";
import { logout, workflowActions, navbarActions } from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";
import { authHeader } from "../../_helpers";
import SelectLanguage from "../SelectLanguage";
import { FormattedMessage, injectIntl } from "react-intl";
import MetaGraph from "../Workflow/MetaGraph";
import { siteOrigin } from "../../../config";
import Anchor from "../common/Anchor";
import Godaam from "../../utils/storage";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

class NavTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      showInsights: false
    };
  }

  onLogout(key) {
    logout();
  }

  onSearch = e => {
    if (this.state.searchInput.length >= 3) {
      if (e) {
        this.props.dispatch(workflowActions.searchWorkflow(e));
      } else {
        this.props.dispatch(workflowActions.getAll());
      }
    } else {
      openNotificationWithIcon({
        type: "error",
        message: "Please enter at least 3 characters to initiate search"
      });
    }
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

  onMenuToggle = () => {
    this.props.dispatch(
      navbarActions.toggleFilterMenu(!this.props.showFilterMenu.show)
    );
  };

  getExportList = () => {
    const kind = this.props.workflowKind.workflowKind;
    return (
      <SubMenu
        key="sub4"
        title={
          <span>
            <Icon type="download" />
          </span>
        }
      >
        {_.map(kind, function(item, index) {
          if (
            !item.is_related_kind &&
            _.includes(item.features, "add_workflow")
          ) {
            return (
              <Menu.Item key={`item_${index}`}>
                <a
                  href={
                    siteOrigin +
                    "/api/v1/workflow-kinds/" +
                    item.tag +
                    "/data-export/"
                  }
                  className="text-nounderline"
                >
                  <i
                    className="material-icons text-primary-dark"
                    style={{
                      width: "20px",
                      fontSize: "14px",
                      verticalAlign: "middle"
                    }}
                  >
                    {item.icon}
                  </i>
                  {item.name}
                </a>
              </Menu.Item>
            );
          }
          return null;
        })}
      </SubMenu>
    );
  };

  render = () => {
    const user = this.props.authentication.user;
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

    // Initializing it to false to start with
    let showInsights = false;
    const showExportOption =
      this.props.config.permissions &&
      this.props.config.permissions.includes("Can export workflow data");
    if (user && _.includes(user.features, "view_reports")) {
      showInsights = true;
    }
    const supportedLaguanges = this.props.config.supported_languages;
    const regexForUrl = /\/instances\/[\d]+/;

    return (
      <div>
        <div className="container navbar-top" id="navbar-top">
          <Header className="ant-nav">
            <Row>
              {/*logo wrapper*/}
              <Col span={12}>
                <span
                  className="logo float-left text-anchor text-base mr-right-sm"
                  title="Toggle filter menu"
                  onClick={this.onMenuToggle}
                >
                  <Tooltip title="Toggle sidebar menu" placement="right">
                    <i className="material-icons text-middle">
                      {this.props.showFilterMenu.show ? "dehaze" : "dehaze"}{" "}
                    </i>
                  </Tooltip>
                </span>

                <span className="logo" style={{ float: "left" }}>
                  <Anchor href={Godaam.magicLogin ? "#" : "#"}>
                    {!this.props.config.loading && this.props.config.logo ? (
                      <img
                        alt={this.props.config.name}
                        src={this.props.config.logo}
                      />
                    ) : !this.props.config.loading ? (
                      <h3>{this.props.config.name}</h3>
                    ) : (
                      <h3>{authHeader.tenant}</h3>
                    )}
                  </Anchor>
                </span>

                {!regexForUrl.test(document.location.pathname) ? (
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
                {_.isEmpty(supportedLaguanges) ? null : (
                  <SelectLanguage navbar={true} />
                )}
                <Menu
                  theme="light"
                  mode="horizontal"
                  style={{ lineHeight: "62px", float: "right" }}
                  selectable={false}
                >
                  {this.props.workflowKind.workflowKind && showExportOption
                    ? this.getExportList()
                    : null}

                  {showInsights ? (
                    <Menu.Item key="2">
                      <span className="pd-ard-sm" onClick={this.showDrawer}>
                        <i className="material-icons text-light text-anchor t-18 ">
                          trending_up
                        </i>
                      </span>
                    </Menu.Item>
                  ) : null}

                  <SubMenu
                    title={user ? <UserName user={user} /> : ""}
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

const UserName = props => {
  const { user } = props;
  return (
    <span>
      {user.first_name
        ? " " + user.first_name + " " + (user.last_name || "") + " "
        : " " + user.email + " "}
      <i className="material-icons t-14">keyboard_arrow_down</i>
    </span>
  );
};

function mapStateToProps(state) {
  const {
    workflowKind,
    authentication,
    config,
    languageSelector,
    showFilterMenu
  } = state;
  return {
    workflowKind,
    authentication,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(injectIntl(NavTop));
