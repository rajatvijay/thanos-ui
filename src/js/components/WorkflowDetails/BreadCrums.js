import React from "react";
import { workflowDetailsService } from "../../services";
import { Icon } from "antd";

class BreadCrums extends React.Component {
  state = {
    isLoading: false,
    items: null
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    workflowDetailsService
      .getById(this.props.workflowId)
      .then(response => {
        this.setState({ isLoading: false });
        this.setState({ items: response.workflow_family });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { items, isLoading } = this.state;
    console.log("redering", isLoading);

    if (isLoading) {
      return (
        <div className="text-center">
          <Icon type="loading" />
        </div>
      );
    }

    if (!items || !items.length) {
      return null;
    }

    return (
      <div
        style={{
          fontSize: 12,
          marginTop: -15,
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          marginLeft: -15,
          marginRight: -15,
          padding: "2px 80px",
          color: "#305ebe"
        }}
      >
        {items.map(item => <span>{`${item.name} > `}</span>)}
      </div>
    );
  }
}

export default BreadCrums;
