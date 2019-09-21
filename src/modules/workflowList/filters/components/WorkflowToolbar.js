import React, { Component } from "react";
import { Icon } from "antd";
import FilterPopup from "./FilterPopup";
import { connect } from "react-redux";
import { css } from "emotion";
import {
  selectedBasicFiltersSelector,
  workflowCountSelector
} from "../../selectors";
import WorkflowSorter from "./WorkflowSorter";

class WorkflowToolbar extends Component {
  state = {
    isFilterPopupVisible: false
  };
  toggleFilterPopup = () => {
    this.setState(({ isFilterPopupVisible }) => ({
      isFilterPopupVisible: !isFilterPopupVisible
    }));
  };
  render() {
    const { isFilterPopupVisible } = this.state;
    const { selectedBasicWorkflowFilters, workflowCount } = this.props;
    return (
      <>
        <div
          className={css`
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
          `}
        >
          <div
            className={css`
              display: flex;
              justify-content: space-between;
              color: rgba(0, 0, 0, 0.3);
              text-transform: uppercase;
              font-size: 15px;

              > span {
                margin-right: 40px;
              }
            `}
          >
            <span>{workflowCount !== null && `${workflowCount} RESULTS`}</span>
            <span>
              <WorkflowSorter />
            </span>
            <div>
              <span
                className={css`
                  cursor: pointer;
                  user-select: none;
                `}
                onClick={this.toggleFilterPopup}
              >
                Filter
                {isFilterPopupVisible ? (
                  <Icon style={{ marginLeft: 5, fontSize: 10 }} type="up" />
                ) : (
                  <Icon style={{ marginLeft: 5, fontSize: 10 }} type="down" />
                )}
              </span>
              {/* <SelectedBasicFilters filters={selectedBasicWorkflowFilters} /> */}
            </div>
          </div>
        </div>
        {isFilterPopupVisible && <FilterPopup />}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedBasicWorkflowFilters: selectedBasicFiltersSelector(state),
    workflowCount: workflowCountSelector(state)
  };
};

export default connect(mapStateToProps)(WorkflowToolbar);

function SelectedBasicFilters({ filters }) {
  const filterKeys = Object.keys(filters);
  return filterKeys.map(filterName => (
    <span key={filterName}>
      {filterName}: {filters[filterName]}
    </span>
  ));
}
