import React, { Component } from "react";
import Collapsible from "react-collapsible";
import { Icon } from "antd";
import CountWidget from "./CountWidget";
import styled from "@emotion/styled";
import { css } from "emotion";

class Alerts extends Component {
  state = { collapsed: false };

  renderSubCategoryList = () => {
    const { onSelect, item, selected } = this.props;

    if (item.sub_categories) {
      return item.sub_categories.map(subCategory => (
        <StyledAlertSubCategoryListItem
          key={`item_${subCategory.id}`}
          onClick={e => onSelect(subCategory)}
          data-testid="alerts-list-item"
          isSelected={subCategory.name === selected}
        >
          <span>{subCategory.name}</span>
          <CountWidget innerColour="#D40000" value={subCategory.count} />
        </StyledAlertSubCategoryListItem>
      ));
    }
    return null;
  };

  toggleCollapsible = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  render() {
    const { collapsed } = this.state;
    const { item } = this.props;

    return (
      <StyledAlertListItem
        collapsed={collapsed}
        onClick={this.toggleCollapsible}
      >
        <div
          className={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <div>
            <Icon
              className={css`
                margin: 0px 5px 0px -5px;
                color: white;
              `}
              type="caret-right"
              rotate={collapsed ? 90 : 0}
            />
            <span
              className={css`
                font-size: 16px;
                color: #cfdae3;
              `}
            >
              {item.name}
            </span>
          </div>
          {item.count > 0 && (
            <CountWidget innerColour="#D40000" value={item.count} />
          )}
        </div>

        <Collapsible open={collapsed}>
          <ul
            className={css`
              padding: 0;
            `}
          >
            {this.renderSubCategoryList()}
          </ul>
        </Collapsible>
      </StyledAlertListItem>
    );
  }
}

export default Alerts;

const StyledAlertListItem = styled.li`
  padding-bottom: ${({ collapsed }) => (collapsed ? 30 : 0)};
  background-color: ${({ collapsed }) => (collapsed ? "#093050" : "#104775")};
  transition-duration: 150ms;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
  cursor: pointer;
  &:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }
`;

const StyledAlertSubCategoryListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  background-color: ${({ isSelected }) =>
    isSelected ? "#1489D2" : "rgba(255, 255, 255, 0.15)"};
  border-radius: 30px;
  padding: 3px 3px 0px 12px;
  color: white;
  cursor: pointer;
`;
