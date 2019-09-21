import React, { Component, PureComponent } from "react";
import { Button, Input, Cascader, Divider, Icon } from "antd";
import FilterDropdown from "./FilterDropdown";
import { connect } from "react-redux";
// import { css } from "emotion";
import { FormattedMessage, injectIntl } from "react-intl";
// import { get as lodashGet } from "lodash";
import {
  getStatusesThunk,
  getRegionsThunk,
  getBusinessUnitsThunk,
  applyWorkflowFilterThunk
} from "../../thunks";
import { bindActionCreators } from "redux";
import {
  statusesForFilterDropdownSelector,
  selectedStatusSelector,
  selectedRegionSelector,
  selectedBusinessUnitSelector
} from "../../selectors";
import styled from "@emotion/styled";
import {
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME
} from "../../constants";

/**
 * TODO:
 * [] Business unit is filtered on the basis of selected region
 * [] Status list is filtered on the basis of selected kind
 * [] Add prop types
 * [] Test cases for components
 * [] Test cases for data layer
 * [] test cases for API layer
 * [] Figure out the req for snapshot test cases
 * [] Give allowClear option for all the basic filters => better user experience
 */

const OPERATORS_TYPES = [
  {
    label: (
      <FormattedMessage id="workflowFiltersTranslated.advancedFilterOperators.eq" />
    ),
    value: "eq"
  },
  {
    label: (
      <FormattedMessage id="workflowFiltersTranslated.advancedFilterOperators.not_eq" />
    ),
    value: "not_eq"
  },
  {
    label: (
      <FormattedMessage id="workflowFiltersTranslated.advancedFilterOperators.is_set" />
    ),
    value: "is_set"
  },
  {
    label: (
      <FormattedMessage id="workflowFiltersTranslated.advancedFilterOperators.contains" />
    ),
    value: "contains"
  },
  {
    label: (
      <FormattedMessage id="workflowFiltersTranslated.advancedFilterOperators.not_contains" />
    ),
    value: "not_contains"
  }
];

class FilterPopup extends Component {
  componentDidMount() {
    this.props.getStatusesThunk();
    this.props.getRegionsThunk();
    this.props.getBusinessUnitsThunk();
  }
  handleBasicFilters = field => (_, item) => {
    this.props.applyWorkflowFilterThunk({ field, value: item });
  };
  render() {
    const {
      staticData,
      statuses,
      selectedStatus,
      selectedRegion,
      selectedBusinessUnit
    } = this.props;
    const { regions, businessUnits } = staticData;
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
        />
        <AdvancedFilters />
        <ButtonWrapper>
          <StyledApplyButton type="primary">Apply</StyledApplyButton>
          <StyledButton>Clear All</StyledButton>
          <StyledButton>Close</StyledButton>
        </ButtonWrapper>
      </FilterModalView>
    );
  }
}

function mapStateToProps(state) {
  const { workflowList, config } = state;
  return {
    staticData: workflowList.staticData,
    statuses: statusesForFilterDropdownSelector(state),
    config,
    selectedStatus: selectedStatusSelector(state),
    selectedRegion: selectedRegionSelector(state),
    selectedBusinessUnit: selectedBusinessUnitSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getStatusesThunk,
      getRegionsThunk,
      getBusinessUnitsThunk,
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
    onSelect
  }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <FilterDropdown
        value={selectedStatus}
        data={statuses.data}
        loading={statuses.isLoading}
        placeholder={
          <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.status" />
        }
        onSelect={onSelect(STATUS_FILTER_NAME)}
        searchable
      />
      <FilterDropdown
        value={selectedRegion}
        loading={regions.isLoading}
        data={regions.data}
        placeholder={
          <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.region" />
        }
        onSelect={onSelect(REGION_FILTER_NAME)}
        searchable
      />
      <FilterDropdown
        loading={businessUnits.isLoading}
        value={selectedBusinessUnit}
        data={businessUnits.data}
        placeholder={
          <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.business_unit" />
        }
        onSelect={onSelect(BUSINESS_UNIT_FILTER_NAME)}
        searchable
      />
    </div>
  )
);

// TODO: Seems to have a lot of extra stylings
class AdvancedFilters extends PureComponent {
  state = {
    currentAdvFiliter: {}
  };
  handleChange = field => value => {
    const { currentAdvFiliter } = this.state;
    const updatedCurrentAdvFilters = {
      ...currentAdvFiliter,
      [field]: value
    };

    // Update it in the state
    this.setState({
      currentAdvFiliter: updatedCurrentAdvFilters
    });

    // If the user has selected all the 3 value
    // update it in the state
    if (
      updatedCurrentAdvFilters.field &&
      updatedCurrentAdvFilters.operator &&
      updatedCurrentAdvFilters.text
    ) {
      this.props.onApply(updatedCurrentAdvFilters);
    }
  };

  render() {
    const { options: advancedFilterOptions } = this.props;
    return (
      <div style={{ marginTop: "20px" }}>
        <span
          style={{
            color: "#138BD6",
            // cursor: "pointer",
            textTransform: "uppercase"
          }}
        >
          <FormattedMessage id={"workflowFiltersTranslated.advancedFilter"} />
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Cascader
            // style={{ flex: 1, marginRight: "40px" }}
            options={advancedFilterOptions}
            onChange={this.handleChange("field")}
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.pleaseSelectField" />
            }
          />

          <FilterDropdown
            data={OPERATORS_TYPES}
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.selectOperator" />
            }
            name="operator"
            onChange={this.handleChange("operator")}
            // style={{ flex: 1, paddingRight: "40px" }}
          />

          <Input
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.inputValue" />
            }
            onChange={e => this.handleChange("text")(e.target.value)}
            // style={{ flex: 1 }}
            // style={{ paddingLeft: 0, width: "100%", marginRight: "40px" }}
          />
        </div>
      </div>
    );
  }
}

const FilterModalView = styled.div`
  height: 270px;
  width: 975px;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 22px;
`;

const StyledApplyButton = styled(Button)`
  width: 70px;
  border-radius: 3px;
  margin-right: 12px;
`;

const StyledButton = styled(Button)`
  width: 95px;
  border-radius: 3px;
  color: #148cd6;
  border-color: #148cd6;
  margin-right: 12px;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
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
