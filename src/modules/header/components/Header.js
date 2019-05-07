import React, { Component } from "react";

import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { authHeader, baseUrl, baseUrl2 } from "../../../js/_helpers";
import { Tooltip } from "antd";

class Header extends Component {
  render() {
    console.log(this.props);
    let user = this.props.authentication.user;
    return (
      <div
        style={{
          background: "#fff",
          position: "fixed",
          width: "100%",
          left: 0,
          zIndex: 2,
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.07)",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {!this.props.config.loading && this.props.config.logo ? (
          <img
            alt={this.props.config.name}
            src={this.props.config.logo}
            style={{
              marginLeft: "17px",
              marginTop: "7px",
              marginBottom: "5px",
              height: "42.5px"
            }}
          />
        ) : !this.props.config.loading ? (
          <h3>{this.props.config.name}</h3>
        ) : (
          <h3>{authHeader.getClient()}</h3>
        )}

        <div
          style={{
            marginRight: "10px",
            width: "250px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                opacity: 0.3,
                color: "#000000",
                fontWeight: 500,
                fontSize: "18px",
                letterSpacing: "-0.03px",
                lineHeight: "22px",
                textålign: "right",
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
          <span
            style={{
              opacity: 0.3,
              color: "#000000",
              fontWeight: 500,
              fontSize: "18px",
              letterSpacing: "-0.03px",
              lineHeight: "22px",
              textålign: "right"
            }}
          >
            EN
          </span>
          {user ? (
            <Tooltip title={user.email} placement="leftBottom">
              <i
                className="material-icons text-middle"
                style={{ fontSize: 36, color: "#000000", opacity: 0.3 }}
              >
                account_circle
              </i>
            </Tooltip>
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
