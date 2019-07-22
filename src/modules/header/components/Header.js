import React, { Component } from "react";

import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { authHeader } from "../../../js/_helpers";
import {
  Tooltip,
  Menu,
  Dropdown,
  Input,
  Icon,
  notification,
  Drawer
} from "antd";
import SelectLanguage from "./SelectLanguage";
import _ from "lodash";
import { logout, workflowActions, navbarActions } from "../../../js/actions";
import "../header.css";
import { Link } from "react-router-dom";
import { apiBaseURL, siteOrigin } from "../../../config";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

const SubMenu = Menu.SubMenu;

class Header extends Component {
  state = {
    searchInput: "",
    showSearchInputIcon: false
  };

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

  toggleSearchIcon = () => {
    this.setState(({ showSearchInputIcon }) => ({
      showSearchInputIcon: !showSearchInputIcon
    }));
  };

  onLogout = (event, key) => {
    // this.props.dispatch(logout());
    logout();
  };

  onMenuToggle = () => {
    this.props.dispatch(
      navbarActions.toggleFilterMenu(!this.props.showFilterMenu.show)
    );
  };

  getExportList = () => {
    let kind = this.props.workflowKind.workflowKind;

    return (
      <Dropdown
        placement="bottomCenter"
        icon={<Icon />}
        overlay={
          <Menu>
            {_.map(kind, function(item, index) {
              if (
                !item.is_related_kind &&
                _.includes(item.features, "add_workflow")
              ) {
                return (
                  <Menu.Item key={index}>
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
          </Menu>
        }
        trigger={["click"]}
      >
        <Tooltip title="Export data" placement="left">
          <span
            className="pd-ard-sm mr-right-lg "
            style={{
              fontSize: 24,
              color: "#000000",
              opacity: 0.3,
              cursor: "pointer"
            }}
          >
            <Icon type="download" />
          </span>
        </Tooltip>
      </Dropdown>
    );
  };

  render() {
    const { searchInput, showSearchInputIcon } = this.state;
    let user = this.props.authentication.user;
    let supportedLaguanges = this.props.config.supported_languages;
    let regexForUrl = /\/instances\/[\d]+/;
    let showExportOption =
      this.props.config.permissions &&
      this.props.config.permissions.includes("Can export workflow data");
    let showInsights = false;

    if (
      user &&
      user.features.includes("view_reports") &&
      this.props.config &&
      this.props.config.report_embed_url
    ) {
      showInsights = true;
    }

    return (
      <div
        style={{
          background: "#fff",
          position: "fixed",
          width: "100%",
          left: 0,
          zIndex: 2,
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "60px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* <span
            className="logo float-left text-anchor text-base mr-right-sm"
            title="Toggle filter menu"
            onClick={this.onMenuToggle}
          >
            <Tooltip title="Toggle sidebar menu" placement="right">
              <i className="material-icons text-middle">
                {this.props.showFilterMenu.show ? "dehaze" : "dehaze"}{" "}
              </i>
            </Tooltip>
          </span> */}
          <a href="/">
            {!this.props.config.loading && this.props.config.logo ? (
              <img
                alt={this.props.config.name}
                src={this.props.config.logo}
                style={{
                  marginLeft: "27px",
                  height: "34px"
                }}
              />
            ) : !this.props.config.loading ? (
              <h3>{this.props.config.name}</h3>
            ) : (
              <h3>{authHeader.tenant}</h3>
            )}
          </a>
        </div>
        <div
          style={{
            marginRight: "29.66px",
            width: regexForUrl.test(document.location.pathname)
              ? _.isEmpty(supportedLaguanges)
                ? "180px"
                : "180px"
              : "350px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {showInsights ? (
            <div style={{ display: "flex", alignItems: "end" }}>
              <Tooltip title="Show Reports" placement="left">
                <Link to="/reports/">
                  <i
                    className="material-icons text-middle text-anchor"
                    style={{ fontSize: 24, color: "#000000", opacity: 0.3 }}
                  >
                    trending_up
                  </i>
                </Link>
              </Tooltip>
            </div>
          ) : null}

          {this.props.workflowKind.workflowKind && showExportOption
            ? this.getExportList()
            : null}

          {!regexForUrl.test(document.location.pathname) ? (
            showSearchInputIcon ? (
              <div className={"search-box "}>
                <Input
                  style={{
                    display: "inline",
                    border: "none",
                    borderRadius: 0
                  }}
                  className={"ant-input"}
                  suffix={
                    <Icon
                      type="search"
                      onClick={() => this.onSearch(searchInput)}
                      className="text-anchor"
                      style={{ fontSize: 24, color: "#000000", opacity: 0.3 }}
                    />
                  }
                  value={searchInput}
                  placeholder={this.props.intl.formatMessage({
                    id: "commonTextInstances.search"
                  })}
                  onChange={this.onSearchChange}
                  ref={node => (this.searchInput = node)}
                  onKeyPress={this.handleKeyPress}
                />
                {/* <Icon onClick={this.toggleSearchIcon} type="close-circle" /> */}
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "end" }}
                onClick={this.toggleSearchIcon}
              >
                <span
                  style={{
                    opacity: 0.3,
                    color: "#000000",
                    fontWeight: 500,
                    fontSize: "18px",
                    letterSpacing: "-0.03px",
                    lineHeight: "22px",
                    marginRight: "8px"
                  }}
                >
                  Search
                </span>
                <i
                  className="material-icons text-middle"
                  style={{ fontSize: 24, color: "#000000", opacity: 0.3 }}
                >
                  search
                </i>
              </div>
            )
          ) : null}
          {_.isEmpty(supportedLaguanges) || <SelectLanguage navbar={true} />}

          {user ? (
            <Dropdown
              icon={<Icon />}
              overlay={
                <Menu>
                  <Menu.Item
                    key="logout"
                    onClick={e => this.onLogout(e, "key")}
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
            >
              <Tooltip title={user.email} placement="leftBottom">
                <i
                  className="material-icons text-middle"
                  style={{
                    fontSize: 32,
                    color: "#000000",
                    opacity: 0.3,
                    cursor: "pointer"
                  }}
                >
                  account_circle
                </i>
              </Tooltip>
            </Dropdown>
          ) : null}
        </div>
      </div>
    );
  }
}

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

export default connect(mapStateToProps)(injectIntl(Header));
