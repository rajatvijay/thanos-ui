import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
//import '../../css/App.css'

class NavTop extends Component {
  render() {
    return (
      <div
        className="workflow-list-page workflow-list-page-container container"
        id="workflow-list-page"
      >
        nav Top
      </div>
    );
  }
}

export default () => <NavTop />;
