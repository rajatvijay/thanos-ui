import React, { Component } from "react";
import { Icon } from "antd";
import FilterPopup from "./FilterPopup";
import { connect } from "react-redux";
import { css } from "emotion";

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
    const { selectedWorkflowFilters } = this.props;
    return (
      <div>
        <div>
          <span
            className={css`
              cursor: pointer;
              user-select: none;
            `}
            onClick={this.toggleFilterPopup}
          >
            Filter
            {isFilterPopupVisible ? <Icon type="up" /> : <Icon type="down" />}
          </span>
          <SelectedBasicFilters filters={selectedWorkflowFilters} />
          {isFilterPopupVisible && <FilterPopup />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedWorkflowFilters: state.workflowList.selectedWorkflowFilters
  };
};

export default connect(mapStateToProps)(WorkflowToolbar);

function SelectedBasicFilters({ filters }) {
  const filterKeys = Object.keys(filters);
  return filterKeys.map(filterName => (
    <span>
      {filterName}: {filters[filterName]}
    </span>
  ));
}
