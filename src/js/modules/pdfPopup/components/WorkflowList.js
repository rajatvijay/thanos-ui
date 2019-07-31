import React, { Component } from "react";
import Workflows from "./Workflows";

class WorkflowList extends Component {
  renderList = (list, onChange, name) => {
    return list.map(workflow => {
      return <Workflows onChange={onChange} workflow={workflow} name={name} />;
    });
  };

  render() {
    const { data, onChange } = this.props;
    console.log("d", data);

    return (
      <div>
        <Workflows
          name="parent_steps_to_print"
          onChange={onChange}
          workflow={data.parent_workflows}
        />
        {this.renderList(
          data.child_workflows,
          onChange,
          "child_steps_to_print"
        )}
        {this.renderList(data.static_sections, onChange, "static_sections")}
        {/* <Workflows/> */}
      </div>
    );
  }
}

export default WorkflowList;
