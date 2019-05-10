import React, { Component } from "react";
import { Menu, Dropdown, Icon } from "antd";
import { connect } from "react-redux";
import { workflowKindActions, createWorkflow } from "../../../../actions";

class CreateNew extends Component {
  loadWorkflowKind = () => {
    this.props.dispatch(workflowKindActions.getAll());
  };

  handleWorkflowKindClick = tag => {
    const payload = {
      status: 1,
      kind: tag,
      name: "Draft"
    };
    this.props.dispatch(createWorkflow(payload));
  };

  getFilteredWorkflowKind = workflowKind => {
    return workflowKind.filter(
      kind =>
        !kind.is_related_kind &&
        kind.features.includes("add_workflow") &&
        !["users", "entity-id"].includes(kind.tag)
    );
  };

  getKindMenu = () => {
    const { workflowKind } = this.props;

    // Error case
    if (workflowKind.error) {
      return (
        <Menu className="kind-menu" theme="Light">
          <Menu.Item key="1" className="text-primary text-medium">
            <span onClick={this.loadWorkflowKind}>
              <i className="material-icons t-14 pd-right-sm">refresh</i> Reload
            </span>
          </Menu.Item>
        </Menu>
      );
    }

    // No kind from backend case
    if (workflowKind.workflowKind && !workflowKind.workflowKind.length) {
      return (
        <Menu className="kind-menu" theme="Light">
          <Menu.Item key="1" className="text-grey text-medium" disabled>
            <span>
              <i className="material-icons t-14 pd-right-sm">error</i> Empty
            </span>
          </Menu.Item>
        </Menu>
      );
    }

    // Happy case, we have some kinds
    const filteredWorkflow = this.getFilteredWorkflowKind(
      workflowKind.workflowKind || []
    );
    return (
      <Menu className="kind-menu" theme="Light">
        {filteredWorkflow.map(function(item, index) {
          return (
            <Menu.Item key={"key-" + index}>
              <div
                onClick={() => this.handleWorkflowKindClick(item.tag)}
                className="kind-item"
              >
                {item.name}
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  render() {
    return (
      <div style={{ paddingRight: 36 }}>
        <Dropdown overlay={this.getKindMenu()} placement="bottomCenter">
          <p
            style={{
              backgroundColor: "#138BD6",
              borderRadius: "50%",
              height: 40,
              width: 40,
              lineHeight: "40px",
              textAlign: "center",
              fontSize: 24,
              color: "white",
              boxShadow: "1px 5px 8px rgba(0, 0, 0, .12)"
            }}
            className="ant-dropdown-link"
          >
            <Icon type="plus" />
          </p>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(CreateNew);
