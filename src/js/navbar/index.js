import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import NavTop from "./nav-top";
import NavLeft from "./nav-left";
//import '../../css/App.css'

class Navbar extends Component {
  render() {
    return (
      <div className="navbar" id="navbar">
        <NavTop />
        <NavLeft />
      </div>
    );
  }
}

export default () => <Navbar />;
