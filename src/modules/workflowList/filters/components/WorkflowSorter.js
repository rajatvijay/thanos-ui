import React, { Component } from "react";
import { connect } from "react-redux";
import { applyWorkflowFilterThunk } from "../../thunks";
import {
  selectedKindSelector,
  selectedSortingOrderSelector,
  isWorkflowSortingEnabledSelector
} from "../../selectors";
import { injectIntl, FormattedMessage } from "react-intl";
import { Icon } from "antd";
import { css } from "emotion";
import { PRIMARY_KEY_SORTING_FILTER_NAME } from "../../constants";
import {
  WORKLFOW_ASC_SORT_PARAM,
  WORKLFOW_DESC_SORT_PARAM
} from "../../constants";

class WorkflowSorter extends Component {
  handleSorting = () => {
    const { sortingOrder } = this.props;
    switch (sortingOrder) {
      case WORKLFOW_ASC_SORT_PARAM:
        return this.props.applyWorkflowFilterThunk({
          field: PRIMARY_KEY_SORTING_FILTER_NAME,
          value: { value: WORKLFOW_DESC_SORT_PARAM }
        });
      case WORKLFOW_DESC_SORT_PARAM:
        return this.props.applyWorkflowFilterThunk({
          field: PRIMARY_KEY_SORTING_FILTER_NAME,
          value: null
        });
      default:
        return this.props.applyWorkflowFilterThunk({
          field: PRIMARY_KEY_SORTING_FILTER_NAME,
          value: { value: WORKLFOW_ASC_SORT_PARAM }
        });
    }
  };
  getSortingIcon = () => {
    const { sortingOrder } = this.props;
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
    }[sortingOrder];
  };
  render() {
    const { selectedKind, sortingOrder, isSortingEnabled } = this.props;

    if (!selectedKind || !isSortingEnabled) {
      return null;
    }

    return (
      <span
        className={css`
          cursor: pointer;
          color: ${sortingOrder ? "black" : "inherit"};
        `}
        onClick={this.handleSorting}
      >
        sort: <FormattedMessage id="mainFilterbar.riskText" />
        {this.getSortingIcon()}
      </span>
    );
  }
}

const mapStateToProps = state => ({
  selectedKind: selectedKindSelector(state),
  sortingOrder: selectedSortingOrderSelector(state),
  isSortingEnabled: isWorkflowSortingEnabledSelector(state)
});

export default connect(
  mapStateToProps,
  { applyWorkflowFilterThunk }
)(injectIntl(WorkflowSorter));
