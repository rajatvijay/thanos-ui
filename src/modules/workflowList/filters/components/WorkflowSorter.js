import React, { Component } from "react";
import { connect } from "react-redux";
import { applyWorkflowFilterThunk } from "../../thunks";
import {
  selectedKindSelector,
  selectedSortingOrderSelector
} from "../../selectors";
import { injectIntl, FormattedMessage } from "react-intl";
import { Icon } from "antd";
import { css } from "emotion";
import { PRIMARY_KEY_SORTING_FILTER_NAME } from "../../constants";

const ASC_SORT_VALUE = "sorting_primary_field";
const DESC_SORT_VALUE = "-sorting_primary_field";

class WorkflowSorter extends Component {
  handleSorting = () => {
    const { sortingOrder } = this.props;
    switch (sortingOrder) {
      case ASC_SORT_VALUE:
        return this.props.applyWorkflowFilterThunk({
          field: PRIMARY_KEY_SORTING_FILTER_NAME,
          value: { value: DESC_SORT_VALUE }
        });
      case DESC_SORT_VALUE:
        return this.props.applyWorkflowFilterThunk({
          field: PRIMARY_KEY_SORTING_FILTER_NAME,
          value: null
        });
      default:
        return this.props.applyWorkflowFilterThunk({
          field: PRIMARY_KEY_SORTING_FILTER_NAME,
          value: { value: ASC_SORT_VALUE }
        });
    }
  };
  getSortingIcon = () => {
    const { sortingOrder } = this.props;
    return {
      [ASC_SORT_VALUE]: (
        <Icon style={{ marginLeft: 5, fontSize: 10 }} type="up" />
      ),
      [DESC_SORT_VALUE]: (
        <Icon style={{ marginLeft: 5, fontSize: 10 }} type="down" />
      )
    }[sortingOrder];
  };
  render() {
    const { selectedKind, sortingOrder } = this.props;

    if (!selectedKind || !selectedKind.is_sorting_field_enabled) {
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
        sort:
        <FormattedMessage id="mainFilterbar.riskText" />
        {this.getSortingIcon()}
      </span>
    );
  }
}

const mapStateToProps = state => ({
  selectedKind: selectedKindSelector(state),
  sortingOrder: selectedSortingOrderSelector(state)
});

export default connect(
  mapStateToProps,
  { applyWorkflowFilterThunk }
)(injectIntl(WorkflowSorter));
