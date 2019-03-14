import React from "react";
import { workflowDetailsService } from "../../services";

class BreadCrums extends React.Component {
  state = {
    items: null
  };

  componentDidUpdate(previousProps) {
    if (this.props.workflowId !== previousProps.workflowId) {
      workflowDetailsService
        .getById(this.props.workflowId)
        .then(response => {
          this.setState({ items: response.workflow_family });
        })
        .catch(err => {});
    }
  }

  render() {
    const { items } = this.state;

    if (!items || !items.length) {
      return null;
    }

    return (
      <div>
        {items.map((item, index) => (
          <span>
            {index !== 0 ? ">" : null}
            {item}
          </span>
        ))}
      </div>
    );
  }
}

export default BreadCrums;
