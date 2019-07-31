import React, { Component } from "react";
import { Checkbox } from "antd";

class Workflows extends Component {
  renderList = (workflow, onChange, name) => {
    if (workflow.steps) {
      return workflow.steps.map(step => {
        return (
          <div>
            <Checkbox
              value={step.value}
              onChange={e => onChange(e, name, workflow.value)}
            >
              {step.label}
            </Checkbox>
          </div>
        );
      });
    }

    return (
      <div>
        <Checkbox value={workflow.value} onChange={e => onChange(e, name)}>
          {workflow.label}
        </Checkbox>
      </div>
    );
  };

  render() {
    const { workflow, onChange, name } = this.props;

    return (
      <div>
        <span>{workflow.label}</span>
        {this.renderList(workflow, onChange, name)}
      </div>
    );
  }
}

export default Workflows;
