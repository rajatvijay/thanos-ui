import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
//import '../../css/App.css'

class NavTop extends Component {
  render() {
    return (
      <div
        className="lifecycle-list-page lifecycle-list-page-container container"
        id="lifecycle-list-page"
      >
        nav Top
      </div>
    );
  }
}

export default () => <NavTop />;
