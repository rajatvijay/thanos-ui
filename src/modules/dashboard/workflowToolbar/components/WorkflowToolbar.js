import React, { Component } from "react";
import { Icon } from "antd";
import FilterPopup from "./FilterPopup";
import { connect } from "react-redux";
import { css } from "emotion";
import { workflowCountSelector } from "../../selectors";
import WorkflowSorter from "./WorkflowSorter";
import CreateNew from "./CreateNew";
import withFilters from "../../filters";
import { FILTERS_ENUM } from "../../constants";
import styled from "@emotion/styled";

class WorkflowToolbar extends Component {
  state = {
    isFilterPopupVisible: false
  };
  toggleFilterPopup = () => {
    this.setState(({ isFilterPopupVisible }) => ({
      isFilterPopupVisible: !isFilterPopupVisible
    }));
  };
  handleRemoveBasicFilter = filterName => {
    this.props.removeFilters([filterName]);
  };
  get selectedAdvancedFilter() {
    return this.props.getSelectedFilterValue(
      FILTERS_ENUM.ADVANCED_FILTER.name,
      "value"
    );
  }
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
            border-bottom: 1px solid rgba(52, 59, 76, 0.3);
            align-items: baseline;
          `}
        >
          <div
            className={css`
              display: flex;
              color: rgba(0, 0, 0, 0.3);
              text-transform: uppercase;
              font-size: 13px;
              align-items: center;
              flex: 1;

              > span {
                margin-right: 40px;
              }
            `}
          >
            <span>{workflowCount !== null && `${workflowCount} RESULTS`}</span>
            <span>
              <WorkflowSorter />
            </span>
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
            <div
              className={css`
                display: flex;
                flex-wrap: wrap;
                flex: 1;
                flex-basis: 50%;
              `}
            >
              <SelectedBasicFilters
                basicFilters={selectedBasicWorkflowFilters}
                onRemove={this.handleRemoveBasicFilter}
                advancedFilter={{
                  name: FILTERS_ENUM.ADVANCED_FILTER.name,
                  value: this.selectedAdvancedFilter
                }}
              />
            </div>
          </div>
          <CreateNew />
        </div>
        <FilterPopup
          visible={isFilterPopupVisible}
          onClose={this.toggleFilterPopup}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    workflowCount: workflowCountSelector(state)
  };
};

export default connect(mapStateToProps)(withFilters(WorkflowToolbar));

function SelectedBasicFilters({ basicFilters, onRemove, advancedFilter }) {
  return (
    <>
      {basicFilters.map(
        filter =>
          filter.value && (
            <StyledSelectedFilterDisplayer key={filter.name}>
              {filter.label}: {filter.value}
              <StyledSelectedFilterCross onClick={e => onRemove(filter.name)}>
                &#10005;
              </StyledSelectedFilterCross>
            </StyledSelectedFilterDisplayer>
          )
      )}
      {advancedFilter.value && (
        <StyledSelectedFilterDisplayer>
          {advancedFilter.value.replace(/__/g, " ").replace(/_/g, " ")}
          <StyledSelectedFilterCross
            onClick={e => onRemove(advancedFilter.name)}
          >
            &#10005;
          </StyledSelectedFilterCross>
        </StyledSelectedFilterDisplayer>
      )}
    </>
  );
}

const StyledSelectedFilterDisplayer = styled.span`
  font-size: 12px;
  margin: 0 5px;
  background: #ddd;
  color: black;
  padding: 4px 8px;
  border-radius: 5px;
  letter-spacing: 0.4px;
  margin-bottom: 5px;
`;

const StyledSelectedFilterCross = styled.span`
  margin-left: 5px;
  cursor: pointer;
`;
