import React, { Component } from "react";
import { Button } from "antd";
import FilterDropdown from "./FilterDropdown";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  statusesForFilterDropdownSelector,
  regionPlaceholderSelector,
  businessUnitPlaceholderSelector
} from "../../selectors";
import styled from "@emotion/styled";
import { FILTERS_ENUM } from "../../constants";
import { FilterDropdownClass, FilterRow } from "./styledComponents";
import AdvancedFilters from "./AdvancedFilter";
import withFilters from "../../filters";

/**
 * TODO: Please do this before merging the PR
 * [x] Business unit is filtered on the basis of selected region
 * [x] Status list is filtered on the basis of selected kind
 * [] No workflow found state
 * [] Add prop types
 * [] Test cases for components
 * [] Test cases for data layer
 * [] test cases for API layer
 * [] Figure out the req for snapshot test cases
 * [] Give allowClear option for all the basic filters => better user experience
 */

class FilterPopup extends Component {
  state = {
    advancedFilters: null
  };
  handleBasicFilters = filter => (_, item) => {
    this.props.addFilters([
      {
        name: filter.name,
        key: filter.key,
        value: item.value,
        meta: item
      }
    ]);
  };

  handleClearFilter = () => {
    this.props.removeFilters([
      FILTERS_ENUM.STATUS_FILTER.name,
      FILTERS_ENUM.REGION_FILTER.name,
      FILTERS_ENUM.BUSINESS_UNIT_FILTER.name,
      FILTERS_ENUM.ADVANCED_FILTER.name
    ]);
  };

  handleAdvancedFilterUpdate = advancedFilters => {
    this.setState({ advancedFilters });
  };

  handleAdvancedFilterApply = () => {
    const { field, operator, text } = this.state.advancedFilters;
    this.props.addFilters([
      {
        name: FILTERS_ENUM.ADVANCED_FILTER.name,
        key: FILTERS_ENUM.ADVANCED_FILTER.key,
        value: `${field[field.length - 1]}__${operator}__${text}`,
        meta: {
          field,
          operator,
          text
        }
      }
    ]);
  };

  get regionPlaceholder() {
    return (
      this.props.regionPlaceholder ||
      this.props.intl.formatMessage({
        id: "workflowFiltersTranslated.filterPlaceholders.region"
      })
    );
  }

  get businessUnitPlaceholder() {
    return (
      this.props.businessUnitPlaceholder ||
      this.props.intl.formatMessage({
        id: "workflowFiltersTranslated.filterPlaceholders.business_unit"
      })
    );
  }

  get selectedStatus() {
    // getSelectedFilterValue returns null, in case of no value,
    // but that makes the placeholder go invisible;
    return (
      this.props.getSelectedFilterValue(
        FILTERS_ENUM.STATUS_FILTER.name,
        "value"
      ) || undefined
    );
  }

  get selectedRegion() {
    // getSelectedFilterValue returns null, in case of no value,
    // but that makes the placeholder go invisible;
    return (
      this.props.getSelectedFilterValue(
        FILTERS_ENUM.REGION_FILTER.name,
        "value"
      ) || undefined
    );
  }

  get selectedBusinessUnit() {
    // getSelectedFilterValue returns null, in case of no value,
    // but that makes the placeholder go invisible;
    return (
      this.props.getSelectedFilterValue(
        FILTERS_ENUM.BUSINESS_UNIT_FILTER.name,
        "value"
      ) || undefined
    );
  }

  render() {
    const { staticData, statuses } = this.props;
    const { regions, businessUnits, advancedFilterData } = staticData;
    return (
      <FilterModalView>
        <BasicFilters
          statuses={statuses}
          regions={regions}
          businessUnits={businessUnits}
          onSelect={this.handleBasicFilters}
          selectedStatus={this.selectedStatus}
          selectedRegion={this.selectedRegion}
          selectedBusinessUnit={this.selectedBusinessUnit}
          businessUnitPlaceholder={this.businessUnitPlaceholder}
          regionPlaceholder={this.regionPlaceholder}
          statusPlaceholder={
            <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.status" />
          }
        />
        <AdvancedFilters
          onApply={this.handleAdvancedFilterUpdate}
          options={advancedFilterData.data}
        />
        <FilterButtonsContainer>
          <Button onClick={this.handleAdvancedFilterApply} type="primary">
            Apply
          </Button>
          <Button onClick={this.handleClearFilter}>Clear All</Button>
          <Button onClick={this.props.onClose}>Close</Button>
        </FilterButtonsContainer>
      </FilterModalView>
    );
  }
}

function mapStateToProps(state) {
  return {
    staticData: state.workflowList.staticData,
    statuses: statusesForFilterDropdownSelector(state),
    regionPlaceholder: regionPlaceholderSelector(state),
    businessUnitPlaceholder: businessUnitPlaceholderSelector(state)
  };
}

export default connect(mapStateToProps)(injectIntl(withFilters(FilterPopup)));

/////////////////////////////////////////////////////////////////////////////
// Utils

const BasicFilters = injectIntl(
  ({
    selectedStatus,
    selectedRegion,
    selectedBusinessUnit,
    statuses,
    regions,
    businessUnits,
    businessUnitPlaceholder,
    regionPlaceholder,
    statusPlaceholder,
    onSelect
  }) => (
    <FilterRow>
      <FilterDropdown
        value={selectedStatus}
        data={statuses.data}
        loading={statuses.isLoading}
        placeholder={statusPlaceholder}
        onSelect={onSelect(FILTERS_ENUM.STATUS_FILTER)}
        searchable
        className={FilterDropdownClass}
      />
      <FilterDropdown
        value={selectedRegion}
        loading={regions.isLoading}
        data={regions.data}
        placeholder={regionPlaceholder}
        onSelect={onSelect(FILTERS_ENUM.REGION_FILTER)}
        searchable
        className={FilterDropdownClass}
      />
      <FilterDropdown
        loading={businessUnits.isLoading}
        value={selectedBusinessUnit}
        data={businessUnits.data}
        placeholder={businessUnitPlaceholder}
        onSelect={onSelect(FILTERS_ENUM.BUSINESS_UNIT_FILTER)}
        searchable
        className={FilterDropdownClass}
      />
    </FilterRow>
  )
);

const FilterModalView = styled.div`
  height: 250px;
  background-color: #ffffff;
  border-bottom: 1px solid #979797;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FilterButtonsContainer = styled.div`
  align-items: center;
  display: flex;

  button {
    margin-right: 10px;
  }
`;
