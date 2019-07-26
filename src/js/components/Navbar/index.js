import React, { Component } from "react";
import NavTop from "./nav-top";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar" id="navbar">
        <NavTop />
      </div>
    );
  }
}

export default () => <Navbar />;
