import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Icon } from "antd";
import { css } from "emotion";
import { FILTERS_ENUM } from "../../constants";
import {
  WORKLFOW_ASC_SORT_PARAM,
  WORKLFOW_DESC_SORT_PARAM
} from "../../constants";
import withFilters from "../../filters";
import lodashGet from "lodash/get";

class WorkflowSorter extends Component {
  handleSorting = () => {
    const page1Filter = {
      name: FILTERS_ENUM.PAGE_FILTER.name,
      key: FILTERS_ENUM.PAGE_FILTER.key,
      value: 1,
      meta: 1
    };
    switch (this.sortingOrder) {
      case WORKLFOW_ASC_SORT_PARAM:
        return this.props.addFilters([
          {
            name: FILTERS_ENUM.ORDERING_FILTER.name,
            key: FILTERS_ENUM.ORDERING_FILTER.key,
            value: WORKLFOW_DESC_SORT_PARAM,
            meta: WORKLFOW_DESC_SORT_PARAM
          },

          // Moving user to page 1 when a filter is applied
          page1Filter
        ]);
      case WORKLFOW_DESC_SORT_PARAM:
        this.props.removeFilters([FILTERS_ENUM.ORDERING_FILTER.name]);
        this.props.addFilters(page1Filter);
        return;
      default:
        return this.props.addFilters([
          {
            name: FILTERS_ENUM.ORDERING_FILTER.name,
            key: FILTERS_ENUM.ORDERING_FILTER.key,
            value: WORKLFOW_ASC_SORT_PARAM,
            meta: WORKLFOW_ASC_SORT_PARAM
          },

          // Moving user to page 1 when a filter is applied
          page1Filter
        ]);
    }
  };
  get sortingOrder() {
    return this.props.getSelectedFilterValue(FILTERS_ENUM.ORDERING_FILTER.name);
  }
  get selectedKind() {
    return this.props.getSelectedFilterValue(FILTERS_ENUM.KIND_FILTER.name);
  }
  get isSortingEnabled() {
    return lodashGet(this.selectedKind, "is_sorting_field_enabled", false);
  }
  getSortingIcon = () => {
    return {
      [WORKLFOW_ASC_SORT_PARAM]: (
        <Icon
          style={{ marginLeft: 5, fontSize: 10 }}
          data-testid="sorting-up"
          type="up"
        />
      ),
      [WORKLFOW_DESC_SORT_PARAM]: (
        <Icon
          style={{ marginLeft: 5, fontSize: 10 }}
          data-testid="sorting-down"
          type="down"
        />
      )
    }[this.sortingOrder];
  };
  render() {
    if (!this.selectedKind || !this.isSortingEnabled) {
      return null;
    }

    return (
      <span
        className={css`
          cursor: pointer;
          color: ${this.sortingOrder ? "black" : "inherit"};
        `}
        onClick={this.handleSorting}
      >
        sort: <FormattedMessage id="mainFilterbar.riskText" />
        {this.getSortingIcon()}
      </span>
    );
  }
}

export default injectIntl(withFilters(WorkflowSorter));
