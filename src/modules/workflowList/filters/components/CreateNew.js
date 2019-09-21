import React, { Component } from "react";
import { Menu, Dropdown, Icon, message } from "antd";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../../js/_helpers/intl-helpers";
import { css } from "emotion";
import { kindsForNewWorkflowSelector } from "../../selectors";
import { createWorkflowThunk } from "../../thunks";
import { history } from "../../../../js/_helpers";

class CreateNew extends Component {
  handleWorkflowKindClick = kind => {
    const payload = {
      status: kind.default_status,
      kind: kind.tag,
      name: "Draft"
    };

    const hideLoader = message.loading("Preparing Workflow", 0);
    this.props.createWorkflowThunk(payload).then(({ id }) => {
      hideLoader();
      history.push(`/workflows/instances/${id}`);
    });
  };

  getKindMenu = () => {
    const { workflowKinds } = this.props;
    return (
      <Menu>
        {workflowKinds.map(item => (
          <Menu.Item
            key={item.id}
            onClick={() => this.handleWorkflowKindClick(item)}
          >
            {getIntlBody(item, "name")}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  render() {
    const { isLoading, workflowKinds } = this.props;

    if (isLoading) {
      return <Icon style={{ fontSize: 24 }} type="loading" />;
    }

    if (!workflowKinds) {
      return null;
    }

    return (
      <div>
        <Dropdown overlay={this.getKindMenu()} placement="bottomCenter">
          <span
            className={css`
              background-color: #138bd6;
              border-radius: 50%;
              height: 40px;
              width: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 24px;
              color: white;
              box-shadow: 1px 5px 8px rgba(0, 0, 0, 0.12);
              display: inline-block;
            `}
          >
            <Icon type="plus" />
          </span>
        </Dropdown>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.workflowList.kinds.isLoading,
  workflowKinds: kindsForNewWorkflowSelector(state)
});

export default connect(
  mapStateToProps,
  { createWorkflowThunk }
)(injectIntl(CreateNew));
