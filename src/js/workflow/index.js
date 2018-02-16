import React, { Component } from "react";
import Auxbar from "./auxbar";
import Workflows from "./workflow-list";
import "../../css/App.css";
//import { BrowserRouter, Route, Switch, Link} from 'react-router-dom';

class List extends Component {
  render() {
    return (
      <div
        className="workflow-list-page workflow-list-page-container container"
        id="workflow-list-page"
      >
        <div className="row">
          <div className="col-lg-3">
            <Auxbar />
          </div>
          <div className="col-lg-9">
            <Workflows />
          </div>
        </div>
      </div>
    );
  }
}

export default () => <List />;
