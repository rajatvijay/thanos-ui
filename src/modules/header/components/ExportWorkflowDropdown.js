import React from "react";
import PropTypes from "prop-types";
import { Dropdown, Icon, Menu } from "antd";
import IntlTooltip from "../../../js/components/common/IntlTooltip";
import Anchor from "../../../js/components/common/Anchor";

class DropdownItem extends React.Component {
  handleClick = () => {
    this.props.onItemClick({ kind: this.props.kind.tag });
  };

  render() {
    const { kind, onItemClick, ...menuProps } = this.props;

    return (
      <Menu.Item {...menuProps}>
        <Anchor onClick={this.handleClick} className="text-nounderline">
          <i
            className="material-icons text-primary-dark"
            style={{
              width: "20px",
              fontSize: "14px",
              verticalAlign: "middle"
            }}
          >
            {kind.icon}
          </i>
          {kind.name}
        </Anchor>
      </Menu.Item>
    );
  }
}

DropdownItem.propTypes = {
  kind: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired
};

export const ExportWorkflowDropdown = ({
  kinds,
  onClick,
  loading,
  otherProps
}) => {
  const exportableKinds = kinds.filter(
    kind => !kind.is_related_kind && kind.features.includes("add_workflow")
  );

  return (
    <Dropdown
      placement="bottomCenter"
      icon={<Icon />}
      overlay={
        <Menu>
          {exportableKinds.map((kind, index) => {
            return (
              <DropdownItem
                key={`menu_${index}`}
                kind={kind}
                onItemClick={onClick}
                {...otherProps}
              />
            );
          })}
        </Menu>
      }
      trigger={["click"]}
    >
      <IntlTooltip title={"tooltips.exportDataText"} placement="left">
        <span
          className="pd-ard-sm mr-right-lg "
          style={{
            fontSize: 24,
            color: "#000000",
            opacity: 0.3,
            cursor: "pointer"
          }}
        >
          {loading ? <Icon type="loading" spin /> : <Icon type="download" />}
        </span>
      </IntlTooltip>
    </Dropdown>
  );
};
