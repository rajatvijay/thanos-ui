import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { authHeader } from "../../../js/_helpers";
import { Dropdown, Icon, Input, Menu, notification, Tooltip } from "antd";
import SelectLanguage from "./SelectLanguage";
import _ from "lodash";
import { logout, workflowActions } from "../../../js/actions";
import "../header.css";
import { Link } from "react-router-dom";
import { siteOrigin } from "../../../config";
import { languageConstants } from "../constants";
import IntlTooltip from "../../../js/components/common/IntlTooltip";
import { getIntlBody } from "../../../js/_helpers/intl-helpers";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

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

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.onSearch(this.state.searchInput);
    }
  };

  onLogout = (event, key) => {
    this.props.dispatch(logout());
  };

  getExportList = () => {
    const kind = this.props.workflowKind.workflowKind;
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
                  <Menu.Item key={`menu_${index}`}>
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
                      {getIntlBody(item, "name")}
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
        <IntlTooltip title={"tooltips.exportDataText"} placement="left">
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
        </IntlTooltip>
      </Dropdown>
    );
  };

  render() {
    const { searchInput } = this.state;
    const user = this.props.authentication.user;
    const supportedLaguanges = this.props.config.supported_languages;
    const regexForUrl = /\/instances\/[\d]+/;
    const showExportOption =
      this.props.config.permissions &&
      this.props.config.permissions.includes("Can export workflow data");
    let showInsights = false;

    if (
      user &&
      user.features &&
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
        <div style={{ flexBasis: "300px" }}>
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

        {!regexForUrl.test(document.location.pathname) ? (
          <div
            className="search-box"
            style={{ flexBasis: "300px", marginLeft: "56px" }}
          >
            <Input
              style={{
                display: "inline",
                border: "none",
                borderRadius: 0
              }}
              suffix={
                <Icon
                  type="search"
                  onClick={() => this.onSearch(searchInput)}
                  className="text-anchor"
                  style={{ fontSize: 20, color: "#000000", opacity: 0.3 }}
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
          </div>
        ) : null}

        <div
          style={{
            marginRight: "29.66px",
            width: regexForUrl.test(document.location.pathname)
              ? _.isEmpty(supportedLaguanges)
                ? "180px"
                : "180px"
              : "350px",
            flexGrow: 1,
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          {showInsights ? (
            <span className="pd-ard-sm mr-right-lg ">
              <IntlTooltip title={"tooltips.showReportsText"} placement="left">
                <Link to="/reports/">
                  <i
                    className="material-icons text-middle text-anchor"
                    style={{ fontSize: 24, color: "#000000", opacity: 0.3 }}
                  >
                    trending_up
                  </i>
                </Link>
              </IntlTooltip>
            </span>
          ) : null}

          {this.props.workflowKind.workflowKind && showExportOption
            ? this.getExportList()
            : null}

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
                    <FormattedMessage id={"loginPageInstances.logoutText"} />
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
            >
              <Tooltip title={user.email} placement="leftBottom">
                <span className="pd-ard-sm mr-right-lg ">
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
                </span>
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
