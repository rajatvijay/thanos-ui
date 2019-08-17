import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { authHeader } from "../../../js/_helpers";
import { Dropdown, Icon, Input, Menu, notification, Tooltip } from "antd";
import SelectLanguage from "./SelectLanguage";
import _ from "lodash";
import {
  logout,
  workflowActions,
  changeSearchValue
} from "../../../js/actions";
import "../header.css";
import { Link } from "react-router-dom";
import IntlTooltip from "../../../js/components/common/IntlTooltip";
import { exportWorkflow } from "../services";
import { Chowkidaar } from "../../common/permissions/Chowkidaar";
import Permissions from "../../common/permissions/constants";
import { ExportWorkflowDropdown } from "./ExportWorkflowDropdown";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

class Header extends Component {
  state = {
    showSearchInputIcon: false,
    loading: false
  };

  onSearch = searchValue => {
    if (searchValue.length >= 3) {
      const page = 1;
      this.props.dispatch(workflowActions.searchWorkflow(searchValue, page));
    } else {
      openNotificationWithIcon({
        type: "error",
        message: "Please enter at least 3 characters to initiate search"
      });
    }
  };

  onSearchChange = event => {
    const { value } = event.target;
    this.props.dispatch(changeSearchValue(value));
  };

  onLogout = (event, key) => {
    this.props.dispatch(logout());
  };

  onClickExport = async ({ kind }) => {
    this.setState({
      loading: true
    });
    try {
      const response = await exportWorkflow({ kind });
      if (response.ok) {
        openNotificationWithIcon({
          type: "success",
          message:
            "Your request for export has been accepted, it'll be mailed to you shortly"
        });
      } else {
        const responseJSON = await response.json();
        openNotificationWithIcon({
          type: "error",
          message: responseJSON["detail"]
        });
      }
    } catch (err) {
      openNotificationWithIcon({
        type: "error",
        message:
          "An error occurred while processing your request, please try again later"
      });
    }
    this.setState({
      loading: false
    });
  };

  render() {
    const { searchValue } = this.props.workflowSearch;
    const user = this.props.authentication.user;
    const supportedLaguanges = this.props.config.supported_languages;
    const regexForUrl = /\/instances\/[\d]+/;
    const showExportOption = this.props.workflowKind.workflowKind;
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
