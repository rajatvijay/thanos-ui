import React, { Component } from "react";
import Collapsible from "react-collapsible";
import { Icon } from "antd";
import CountWidget from "./CountWidget";
import styled from "@emotion/styled";
import { css } from "emotion";

class Alerts extends Component {
  state = { open: false };

  handleClick = (e, subCategory) => {
    e.stopPropagation();
    this.props.onClick({
      ...subCategory,
      // Adding parent id to help identify parent easily
      parentId: this.props.item.id
    });
  };

  isSelectedAlert = () => {
    const { selectedAlert, item } = this.props;
    return selectedAlert && selectedAlert.parentId === item.id;
  };

  isSelectedSubCategory = subCategory => {
    const { selectedAlert } = this.props;
    return selectedAlert && selectedAlert.id === subCategory.id;
  };

  renderSubCategoryList = () => {
    const { item } = this.props;

    if (item.sub_categories) {
      return item.sub_categories.map(subCategory => (
        <StyledAlertSubCategoryListItem
          key={`${subCategory.id}`}
          onClick={e => this.handleClick(e, subCategory)}
          data-testid="alerts-list-item"
          isSelected={this.isSelectedSubCategory(subCategory)}
        >
          <span>{subCategory.name}</span>
          <CountWidget
            innerColour={subCategory.color_label}
            value={subCategory.count}
          />
        </StyledAlertSubCategoryListItem>
      ));
    }
    return null;
  };

  toggleCollapsible = e => {
    this.setState(({ open }) => ({ open: !open }));
  };

  render() {
    const { open } = this.state;
    const { item } = this.props;
    return (
      <StyledAlertListItem
        open={open}
        onClick={this.toggleCollapsible}
        highlight={!open && this.isSelectedAlert()}
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
              rotate={open ? 90 : 0}
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
            <CountWidget innerColour={item.color_label} value={item.count} />
          )}
        </div>

        <Collapsible open={open}>
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
  padding-bottom: ${({ open }) => (open ? 30 : 0)};
  background-color: ${({ open, highlight }) =>
    highlight ? "#1489D2" : open ? "#093050" : "#104775"};
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
  align-items: center;
`;
