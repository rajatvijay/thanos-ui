import React, { PureComponent } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { FilterDropdownClass, FilterRow } from "./styledComponents";
import { css } from "emotion";
import { Cascader, Input } from "antd";
import FilterDropdown from "./FilterDropdown";

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
      <div>
        <span
          className={css`
            color: #138bd6;
            text-transform: uppercase;
            font-size: 15px;
          `}
        >
          <FormattedMessage id={"workflowFiltersTranslated.advancedFilter"} />
        </span>
        <FilterRow style={{ marginTop: 14, alignItems: "center" }}>
          <Cascader
            className={FilterDropdownClass}
            options={advancedFilterOptions}
            onChange={this.handleChange("field")}
            placeholder={this.props.intl.formatMessage({
              id: "workflowFiltersTranslated.pleaseSelectField"
            })}
          />

          <FilterDropdown
            className={FilterDropdownClass}
            data={OPERATORS_TYPES}
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.selectOperator" />
            }
            name="operator"
            onSelect={this.handleChange("operator")}
          />

          <Input
            className={FilterDropdownClass}
            placeholder={this.props.intl.formatMessage({
              id: "workflowFiltersTranslated.inputValue"
            })}
            onBlur={e => this.handleChange("text")(e.target.value)}
          />
        </FilterRow>
      </div>
    );
  }
}

export default injectIntl(AdvancedFilters);
