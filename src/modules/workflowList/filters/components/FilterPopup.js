import React, { Component } from "react";
import { Modal, Button, Input, Cascader, Divider, Icon } from "antd";
import DropdownFilter from "./DropdownFilter";
import { connect } from "react-redux";
import { css } from "emotion";
import { FormattedMessage, injectIntl } from "react-intl";

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
      <FormattedMessage id="workflowFiltersTranslated.advancedFilterOperators.not_containsÎ" />
    ),
    value: "not_contains"
  }
];

class FilterPopup extends Component {
  state = {
    status: undefined,
    region: undefined,
    business_unit: undefined,
    operator: undefined,
    text: "",
    field: undefined,
    showError: false,
    advFitlers: []
  };

  //CLEAR ALL ITEMS FROM ADVANCED FILTERS
  onAdvClear = () => {
    this.setState({ advFitlers: [] }, function() {
      this.applyAdvFilters();
    });
    this.props.onModalClose();
  };

  onClear = () => {
    this.props.onClear();
    this.onAdvClear();
  };

  updateAdvanceFilterTextValue = e => {
    const { value } = e.target;
    this.setState({ text: value });
  };

  //ON ADVANCED FILTER APPLY EVENT
  onApply = () => {
    const { field, text, operator } = this.state;
    const { onModalClose } = this.props;
    const advFitlers = this.state.advFitlers;

    if (field && text && operator) {
      const fieldValue = field[field.length - 1];
      const currentFitler = {
        field: fieldValue,
        operator: operator,
        text: text
      };

      advFitlers.push(currentFitler);
      this.setState({ advFitlers: advFitlers });
      this.applyAdvFilters();
      this.clearAdvancedFilterFileds();
      this.setState({ showError: false });
      onModalClose();
    } else {
      this.setState({ showError: true });
    }
  };

  //CLEAR ADVANCED FILTER FILTEDS
  clearAdvancedFilterFileds = () => {
    this.setState({ field: null, operator: null, text: null });
  };

  //CONSTRUCST FILTER STIRNG FROM ADVANCED FILTER STATE AND DISPATCH
  applyAdvFilters = () => {
    let advFitlersString = "";

    if (this.state.advFitlers.length > 0) {
      this.state.advFitlers.forEach((filter, index) => {
        const { field, text, operator } = filter;
        if (index > 0) {
          advFitlersString = advFitlersString.concat("|");
        }
        const currentFitler = `${field}__${operator}__${text}`;
        advFitlersString = advFitlersString.concat(currentFitler);
      });
    }

    this.props.applyFilters("answer", advFitlersString);
  };

  //REMOVE INDIVISUAL FILTER ITEM
  removeAdvFilter = key => {
    const { advFitlers } = this.state;
    advFitlers.splice(key, 1);
    this.setState({ advFitlers: advFitlers });
    this.applyAdvFilters();
  };

  getStatusTypes = () => {
    try {
      const allStatuses = this.props.workflowFilterType.statusType;
      const selectedKind = this.props.workflowKindValue.selectedKindValue;
      if (selectedKind && selectedKind.available_statuses) {
        // This will maintain the order of statuses as defined for the kind
        return selectedKind.available_statuses.map(statusId =>
          allStatuses.find(status => status.id === statusId)
        );
      }
    } catch (e) {}
    return [];
    // previously it would show all statuses
  };

  onFilterChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const {
      workflowFilterType,
      filterState,
      onFilterChange,
      onModalClose
    } = this.props;

    const {
      fieldOptions,
      status,
      region,
      business_unit,
      showError
    } = filterState;

    const { operator, text, field } = this.state;

    const { businessType, regionType } = workflowFilterType;

    return (
      <div
        style={{
          height: "270px",
          width: "975px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #e8e8e8"
        }}
      >
        <Divider style={{ marginTop: 7 }} />
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 28,
            paddingRight: 28
          }}
        >
          <Button
            style={{ width: "70px", borderRadius: 3, marginRight: 12 }}
            type="primary"
            onClick={this.onApply}
          >
            <FormattedMessage id={"commonTextInstances.apply"} />
          </Button>

          <Button
            style={{
              width: "95px",
              borderRadius: 3,
              color: "#148cd6",
              borderColor: "#148cd6",
              marginRight: 12
            }}
            onClick={this.onClear}
          >
            <FormattedMessage id={"commonTextInstances.clear"} />
          </Button>

          <Button
            style={{
              width: "95px",
              borderRadius: 3,
              color: "#148cd6",
              borderColor: "#148cd6",
              marginRight: 12
            }}
            onClick={onModalClose}
          >
            <FormattedMessage id={"commonTextInstances.cancel"} />
          </Button>

          <p
            style={{
              color: "red",
              display: showError ? "block" : "none",
              textAlign: "center"
            }}
          >
            <FormattedMessage
              id={"workflowFiltersTranslated.advancedFilterMandatory"}
            />
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { workflowFilterType, workflowKindValue } = state;
  return {
    workflowFilterType,
    workflowKindValue
  };
}

export default connect(mapStateToProps)(injectIntl(FilterPopup));

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const BasicFilters = injectIntl(
  ({
    selectedStatus,
    selectedRegion,
    selectedBusinessUnit,
    statuses,
    regions,
    businessUnits,
    onFilterChange
  }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 28,
        paddingRight: 28
      }}
    >
      <DropdownFilter
        value={selectedStatus}
        name="status"
        data={statuses.data}
        loading={statuses.isLoading}
        placeholder={
          <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.status" />
        }
        onChange={onFilterChange("status")}
        searchable
        // style={{
        //   width: "130px"
        // }}
      />
      <DropdownFilter
        value={selectedRegion}
        loading={regions.isLoading}
        data={regions.data}
        placeholder={
          <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.region" />
        }
        onChange={onFilterChange("region")}
        searchable
      />
      <DropdownFilter
        loading={businessUnits.isLoading}
        value={selectedBusinessUnit}
        data={businessUnits.data}
        placeholder={
          <FormattedMessage id="workflowFiltersTranslated.filterPlaceholders.business_unit" />
        }
        onChange={onFilterChange("businessUnit")}
        searchable
      />
    </div>
  )
);

class AdvancedFilters extends Component {
  state = {
    currentAdvFiliter: {}
  };
  handleApply = field => value => {
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
    const { advancedFilterOptions } = this.props;
    return (
      <div style={{ marginTop: "20px", paddingLeft: 28, paddingRight: 28 }}>
        <span
          style={{
            color: "#138BD6",
            cursor: "pointer",
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
            style={{ width: "100%", marginRight: "40px" }}
            options={advancedFilterOptions}
            onChange={this.handleApply("field")}
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.pleaseSelectField" />
            }
            // TODO: Check if this is required
            // className={css`
            //   .ant-input {
            //     padding-left: 0;
            //   }
            // `}
          />

          <DropdownFilter
            data={OPERATORS_TYPES}
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.selectOperator" />
            }
            name="operator"
            onChange={this.handleApply("operator")}
          />

          <Input
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.inputValue" />
            }
            onChange={e => this.handleApply("text")(e.target.value)}
            style={{ paddingLeft: 0, width: "100%", marginRight: "40px" }}
          />
        </div>
      </div>
    );
  }
}
