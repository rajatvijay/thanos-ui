import React, { Component } from "react";

class Lifecycles extends Component {
  render() {
    return (
      <div className="lifecycle-list lifecycle-list-container container" id="lifecycle-list">
        <ul>
          <li>i am lifeycle</li>
          <li>i am lifeycle</li>
          <li>i am lifeycle</li>
        </ul>
      </div>
    );
  }
};

export default () => <Lifecycles />;
