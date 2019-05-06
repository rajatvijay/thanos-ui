import React, { Component, Fragment } from "react";
import { Menu, Dropdown } from "antd";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

export const CreateRelated = props => {
  const menuItems = () => {
    let workflowKindFiltered = [];

    _.map(props.relatedKind, function(item) {
      if (item.is_related_kind && _.includes(item.features, "add_workflow")) {
        workflowKindFiltered.push(item);
      }
    });

    return (
      <Menu onClick={props.onChildSelect}>
        {!_.isEmpty(workflowKindFiltered) ? (
          _.map(workflowKindFiltered, function(item, index) {
            return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
          })
        ) : (
          <Menu.Item disabled>No related workflow kind</Menu.Item>
        )}
      </Menu>
    );
  };

  const childWorkflowMenu = menuItems(props);

  if (props.relatedKind && _.size(childWorkflowMenu)) {
    return (
      <Dropdown
        overlay={childWorkflowMenu}
        className="child-workflow-dropdown"
        placement="bottomRight"
      >
        <a className="ant-dropdown-link ant-btn main-btn" href="#">
          + <FormattedMessage id="workflowsInstances.createChildButtonText" />
          <i className="material-icons t-14">keyboard_arrow_down</i>
        </a>
      </Dropdown>
    );
  } else {
    return <span />;
  }
};
