import React, { Component } from "react";
import { Avatar, Row, Col, Collapse } from "antd";
import { Link } from "react-router-dom";

class WorkflowCardHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>header</div>;
  }
}

class WorkflowCardBody extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return <div>Body</div>;
  };
}

export default { WorkflowCardHeader, WorkflowCardBody };
