import React, { Component } from "react";
import { Button } from "antd";
import FilterDropdown from "./FilterDropdown";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { applyWorkflowFilterThunk } from "../../thunks";
import { bindActionCreators } from "redux";
import {
  statusesForFilterDropdownSelector,
  selectedStatusSelector,
  selectedRegionSelector,
  selectedBusinessUnitSelector,
  regionPlaceholderSelector,
  businessUnitPlaceholderSelector
} from "../../selectors";
import styled from "@emotion/styled";
import {
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME,
  ADVANCED_FILTER_NAME
} from "../../constants";
import { FilterDropdownClass, FilterRow } from "./styledComponents";
import AdvancedFilters from "./AdvancedFilter";

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
  handleBasicFilters = field => (_, item) => {
    this.props.applyWorkflowFilterThunk({ field, value: item });
  };

  handleClearFilter = () => {
    this.props.applyWorkflowFilterThunk([
      { field: STATUS_FILTER_NAME, value: null },
      { field: REGION_FILTER_NAME, value: null },
      { field: BUSINESS_UNIT_FILTER_NAME, value: null },
      { field: ADVANCED_FILTER_NAME, value: null }
    ]);
  };

  handleAdvancedFilterUpdate = advancedFilters => {
    this.setState({ advancedFilters });
  };

  handleAdvancedFilterApply = () => {
    const { field, operator, text } = this.state.advancedFilters;
    this.props.applyWorkflowFilterThunk({
      field: ADVANCED_FILTER_NAME,
      value: { value: `${field[field.length - 1]}__${operator}__${text}` }
    });
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

  render() {
    const {
      staticData,
      statuses,
      selectedStatus,
      selectedRegion,
      selectedBusinessUnit
    } = this.props;
    const { regions, businessUnits, advancedFilterData } = staticData;
    return (
      <FilterModalView>
        <BasicFilters
          statuses={statuses}
          regions={regions}
          businessUnits={businessUnits}
          onSelect={this.handleBasicFilters}
          selectedStatus={selectedStatus}
          selectedRegion={selectedRegion}
          selectedBusinessUnit={selectedBusinessUnit}
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
    selectedStatus: selectedStatusSelector(state),
    selectedRegion: selectedRegionSelector(state),
    selectedBusinessUnit: selectedBusinessUnitSelector(state),
    regionPlaceholder: regionPlaceholderSelector(state),
    businessUnitPlaceholder: businessUnitPlaceholderSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      applyWorkflowFilterThunk
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(FilterPopup));

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
        onSelect={onSelect(STATUS_FILTER_NAME)}
        searchable
        className={FilterDropdownClass}
      />
      <FilterDropdown
        value={selectedRegion}
        loading={regions.isLoading}
        data={regions.data}
        placeholder={regionPlaceholder}
        onSelect={onSelect(REGION_FILTER_NAME)}
        searchable
        className={FilterDropdownClass}
      />
      <FilterDropdown
        loading={businessUnits.isLoading}
        value={selectedBusinessUnit}
        data={businessUnits.data}
        placeholder={businessUnitPlaceholder}
        onSelect={onSelect(BUSINESS_UNIT_FILTER_NAME)}
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

// class FilterPopup extends Component {
//   state = {
//     status: undefined,
//     region: undefined,
//     business_unit: undefined,
//     operator: undefined,
//     text: "",
//     field: undefined,
//     showError: false,
//     advFitlers: []
//   };

//   //CLEAR ALL ITEMS FROM ADVANCED FILTERS
//   onAdvClear = () => {
//     this.setState({ advFitlers: [] }, function() {
//       this.applyAdvFilters();
//     });
//     this.props.onModalClose();
//   };

//   onClear = () => {
//     this.props.onClear();
//     this.onAdvClear();
//   };

//   updateAdvanceFilterTextValue = e => {
//     const { value } = e.target;
//     this.setState({ text: value });
//   };

//   //ON ADVANCED FILTER APPLY EVENT
//   onApply = () => {
//     const { field, text, operator } = this.state;
//     const { onModalClose } = this.props;
//     const advFitlers = this.state.advFitlers;

//     if (field && text && operator) {
//       const fieldValue = field[field.length - 1];
//       const currentFitler = {
//         field: fieldValue,
//         operator: operator,
//         text: text
//       };

//       advFitlers.push(currentFitler);
//       this.setState({ advFitlers: advFitlers });
//       this.applyAdvFilters();
//       this.clearAdvancedFilterFileds();
//       this.setState({ showError: false });
//       onModalClose();
//     } else {
//       this.setState({ showError: true });
//     }
//   };

//   //CLEAR ADVANCED FILTER FILTEDS
//   clearAdvancedFilterFileds = () => {
//     this.setState({ field: null, operator: null, text: null });
//   };

//   //CONSTRUCST FILTER STIRNG FROM ADVANCED FILTER STATE AND DISPATCH
//   applyAdvFilters = () => {
//     let advFitlersString = "";

//     if (this.state.advFitlers.length > 0) {
//       this.state.advFitlers.forEach((filter, index) => {
//         const { field, text, operator } = filter;
//         if (index > 0) {
//           advFitlersString = advFitlersString.concat("|");
//         }
//         const currentFitler = `${field}__${operator}__${text}`;
//         advFitlersString = advFitlersString.concat(currentFitler);
//       });
//     }

//     this.props.applyFilters("answer", advFitlersString);
//   };

//   //REMOVE INDIVISUAL FILTER ITEM
//   removeAdvFilter = key => {
//     const { advFitlers } = this.state;
//     advFitlers.splice(key, 1);
//     this.setState({ advFitlers: advFitlers });
//     this.applyAdvFilters();
//   };

//   getStatusTypes = () => {
//     try {
//       const allStatuses = this.props.workflowFilterType.statusType;
//       const availableStatuses = lodashGet(
//         this.props,
//         "workflowFilters.kind.meta.available_statuses"
//       );
//       if (availableStatuses) {
//         // This will maintain the order of statuses as defined for the kind
//         return availableStatuses
//           .map(statusId => allStatuses.find(status => status.id === statusId))
//           .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0));
//       }
//     } catch (e) {}
//     return [];
//     // previously it would show all statuses
//   };

//   onFilterChange = (key, value) => {
//     this.setState({ [key]: value });
//   };

//   render() {
//     const {
//       workflowFilterType,
//       filterState,
//       onFilterChange,
//       onModalClose
//     } = this.props;

//     const {
//       fieldOptions,
//       status,
//       region,
//       business_unit,
//       showError
//     } = filterState;

//     const { operator, text, field } = this.state;

//     const { businessType, regionType } = workflowFilterType;

//     const custom_ui_labels = this.props.config.custom_ui_labels || {};

//     const regionPlaceholder =
//       custom_ui_labels["filterPlaceholders.Region"] ||
//       this.props.intl.formatMessage({
//         id: "workflowFiltersTranslated.filterPlaceholders.region"
//       });

//     const businessPlaceholder =
//       custom_ui_labels["filterPlaceholders.Business"] ||
//       this.props.intl.formatMessage({
//         id: "workflowFiltersTranslated.filterPlaceholders.business_unit"
//       });

//     return (
//       <div
//         style={{
//           height: "270px",
//           width: "975px",
//           backgroundColor: "#FFFFFF",
//           borderBottom: "1px solid #e8e8e8"
//         }}
//       >
//         <BasicFilters />
//         <AdvancedFilters />
//         <Divider style={{ marginTop: 7 }} />
//         <div
//           style={{
//             marginBottom: 12,
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "center",
//             paddingLeft: 28,
//             paddingRight: 28
//           }}
//         >
//           <Button
//             style={{ width: "70px", borderRadius: 3, marginRight: 12 }}
//             type="primary"
//             onClick={this.onApply}
//           >
//             <FormattedMessage id={"commonTextInstances.apply"} />
//           </Button>

//           <Button
//             style={{
//               width: "95px",
//               borderRadius: 3,
//               color: "#148cd6",
//               borderColor: "#148cd6",
//               marginRight: 12
//             }}
//             onClick={this.onClear}
//           >
//             <FormattedMessage id={"commonTextInstances.clear"} />
//           </Button>

//           <Button
//             style={{
//               width: "95px",
//               borderRadius: 3,
//               color: "#148cd6",
//               borderColor: "#148cd6",
//               marginRight: 12
//             }}
//             onClick={onModalClose}
//           >
//             <FormattedMessage id={"commonTextInstances.cancel"} />
//           </Button>

//           <p
//             style={{
//               color: "red",
//               display: showError ? "block" : "none",
//               textAlign: "center"
//             }}
//           >
//             <FormattedMessage
//               id={"workflowFiltersTranslated.advancedFilterMandatory"}
//             />
//           </p>
//         </div>
//       </div>
//     );
//   }
// }
