import React, { Component } from "react";

class Workflows extends Component {
  render() {
    return (
      <div className="workflow-list workflow-list-container container" id="workflow-list">
        <ul>
          <li>i am workflow</li>
          <li>i am workflow</li>
          <li>i am workflow</li>
        </ul>
      </div>
    );
  }
};

export default () => <Workflows />;
