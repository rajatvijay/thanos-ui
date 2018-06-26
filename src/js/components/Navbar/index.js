import React, { Component } from "react";
import NavTop from "./nav-top";
import NavLeft from "./nav-left";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar" id="navbar">
        <NavTop />
        {/*<NavLeft />*/}
      </div>
    );
  }
}

export default () => <Navbar />;
