import React, { Component } from "react";
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
 * [] Figure out the req for snapshot test cases
 * [x] Give allowClear option for all the basic filters => better user experience
 */

class FilterPopup extends Component {
  handleBasicFilters = filter => (_, item) => {
    this.props.addFilters([
      {
        name: filter.name,
        key: filter.key,
        value: item.value,
        meta: item
      },

      // Moving user to page 1 when a filter is applied
      {
        name: FILTERS_ENUM.PAGE_FILTER.name,
        key: FILTERS_ENUM.PAGE_FILTER.key,
        value: 1,
        meta: 1
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
    const { staticData, statuses, visible } = this.props;
    const { regions, businessUnits, advancedFilterData } = staticData;
    return (
      <FilterModalView visible={visible}>
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
          options={advancedFilterData.data}
          onClose={this.props.onClose}
          onClear={this.handleClearFilter}
        />
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
  height: ${({ visible }) => (visible ? "200px" : "0px")};
  background-color: #ffffff;
  border-bottom: 1px solid #979797;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: ${({ visible }) => (visible ? "20px" : "0")};
  padding-bottom: ${({ visible }) => (visible ? "20px" : "0")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  transition: height 0.2s, opacity 0.2s, padding 0.2s;
  opacity: ${({ visible }) => (visible ? "1" : "0")};
`;
