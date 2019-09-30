import React, { Component } from "react";
import { Menu, Dropdown, Icon } from "antd";
import { connect } from "react-redux";
import { workflowKindActions, createWorkflow } from "../../../js/actions";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../js/_helpers/intl-helpers";
import { getVisibleWorkflowKinds } from "../createNew.selector";

class CreateNew extends Component {
  loadWorkflowKind = () => {
    this.props.dispatch(workflowKindActions.getAll());
  };

  handleWorkflowKindClick = kind => {
    const payload = {
      status: kind.default_status,
      kind: kind.tag,
      name: "Draft"
    };
    this.props.dispatch(createWorkflow(payload));
  };

  getKindMenu = () => {
    const { workflowKind, visibleWorkflowKinds } = this.props;
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
    if (!visibleWorkflowKinds.length) {
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
    return (
      <Menu className="kind-menu" theme="Light">
        {visibleWorkflowKinds.map((item, index) => {
          return (
            <Menu.Item key={`${item.id}`}>
              <div
                onClick={() => this.handleWorkflowKindClick(item)}
                className="kind-item"
              >
                {getIntlBody(item, "name")}
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  render() {
    return (
      <div>
        <Dropdown overlay={this.getKindMenu()} placement="bottomCenter">
          <p
            style={{
              backgroundColor: "#138BD6",
              borderRadius: "50%",
              height: 39,
              width: 39,
              lineHeight: "40px",
              textAlign: "center",
              fontSize: 24,
              color: "white",
              boxShadow: "1px 5px 8px rgba(0, 0, 0, .12)"
            }}
            className="ant-dropdown-link"
          >
            <Icon type="plus" data-testid="create-main-workflow" />
          </p>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { workflowKind } = state;
  return {
    workflowKind,
    visibleWorkflowKinds: getVisibleWorkflowKinds(state)
  };
}

export default connect(mapStateToProps)(injectIntl(CreateNew));
