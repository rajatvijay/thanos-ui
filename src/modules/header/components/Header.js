import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { authHeader } from "../../../js/_helpers";
import { Dropdown, Icon, Input, Menu } from "antd";
import SelectLanguage from "./SelectLanguage";
import _ from "lodash";
import {
  logout,
  workflowActions,
  changeSearchValue
} from "../../../js/actions";
import { Link } from "react-router-dom";
import IntlTooltip from "../../../js/components/common/IntlTooltip";
import { exportWorkflow } from "../services";
import { Chowkidaar } from "../../common/permissions/Chowkidaar";
import Permissions from "../../common/permissions/permissionsList";
import { ExportWorkflowDropdown } from "./ExportWorkflowDropdown";
import showNotification from "../../common/notification";

class Header extends Component {
  state = {
    showSearchInputIcon: false,
    loading: false
  };

  onSearch = searchValue => {
    if (searchValue && searchValue.length >= 3) {
      const page = 1;
      this.props.dispatch(workflowActions.searchWorkflow(searchValue, page));
    } else {
      showNotification({
        type: "error",
        message: "notificationInstances.workflowSearchValidationFail"
      });
    }
  };

  onSearchChange = event => {
    const { value } = event.target;
    this.props.dispatch(changeSearchValue(value));
  };

  onLogout = event => {
    this.props.dispatch(logout());
  };

  onClickExport = async ({ kind }) => {
    this.setState({
      loading: true
    });
    try {
      const response = await exportWorkflow({ kind });
      if (response.ok) {
        showNotification({
          type: "success",
          message: "notificationInstances.workflowExportSuccess"
        });
      } else {
        const responseJSON = await response.json();
        showNotification({
          type: "error",
          message: responseJSON["detail"]
        });
      }
    } catch (err) {
      showNotification({
        type: "error",
        message: "notificationInstances.networkError",
        description: "notificationInstances.networkErrorDescription"
      });
    }
    this.setState({
      loading: false
    });
  };

  supportLinks = () => {
    const footerLinks = this.props.config.custom_ui_labels
      ? this.props.config.custom_ui_labels.footer_links
      : [];
    if (footerLinks && footerLinks.length) {
      return footerLinks.map(links => (
        <Menu.Item key={links.label}>
          <Link to={links.url} target="_blank">
            {links.label}
          </Link>
        </Menu.Item>
      ));
    } else {
      return null;
    }
  };

  render() {
    const { searchValue } = this.props.workflowSearch;
    const user = this.props.authentication.user;
    const supportedLaguanges = this.props.config.supported_languages;
    const regexForUrl = /\/instances\/[\d]+/;
    const showExportOption = this.props.workflowKind.workflowKind;
    let showInsights = false;
    const userProfileId = user
      ? this.props.authentication.user.user_profile_workflow
      : null;

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
            data-testid="search-bar"
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
                  onClick={() => this.onSearch(searchValue)}
                  className="text-anchor"
                  style={{ fontSize: 20, color: "#000000", opacity: 0.3 }}
                />
              }
              value={searchValue}
              placeholder={this.props.intl.formatMessage({
                id: "commonTextInstances.search"
              })}
              onChange={this.onSearchChange}
              onPressEnter={() => this.onSearch(searchValue)}
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

          {showExportOption ? (
            <Chowkidaar check={Permissions.CAN_EXPORT_WORKFLOW_DATA}>
              <ExportWorkflowDropdown
                kinds={this.props.workflowKind.workflowKind}
                loading={this.state.loading}
                onClick={this.onClickExport}
              />
            </Chowkidaar>
          ) : null}

          {user ? (
            <Dropdown
              overlay={
                <Menu>
                  {this.supportLinks()}
                  <Menu.Divider style={{ margin: "6px 0px" }} />
                  <SelectLanguage />
                  {userProfileId ? (
                    <Menu.Item key="profile">
                      <Link to={`/workflows/instances/${userProfileId}`}>
                        <FormattedMessage
                          id={"workflowsInstances.profileText"}
                        />
                      </Link>
                    </Menu.Item>
                  ) : null}
                  <Menu.Item key="logout" onClick={this.onLogout}>
                    <FormattedMessage id={"loginPageInstances.logoutText"} />
                  </Menu.Item>
                </Menu>
              }
            >
              <Icon
                type="ellipsis"
                style={{
                  fontSize: 30,
                  color: "#000000",
                  opacity: 0.3
                }}
              />
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
    showFilterMenu,
    workflowSearch
  } = state;
  return {
    workflowKind,
    authentication,
    config,
    languageSelector,
    showFilterMenu,
    workflowSearch
  };
}

export default connect(mapStateToProps)(injectIntl(Header));
