import React, { Component } from "react";

import walmartLOgo from "../../../images/client-logo/walmart_logo.png";

class Header extends Component {
  render() {
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
        <img
          src={walmartLOgo}
          alt="walmart logo"
          style={{
            marginLeft: "17px",
            marginTop: "7px",
            marginBottom: "5px",
            height: "42.5px"
          }}
        />
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
          <i
            className="material-icons text-middle"
            style={{ fontSize: 36, color: "#000000", opacity: 0.3 }}
          >
            account_circle
          </i>
        </div>
      </div>
    );
  }
}

export default Header;
