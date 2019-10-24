import React, { PureComponent } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { FilterDropdownClass, FilterRow } from "./styledComponents";
import { css } from "emotion";
import { Cascader, Input, Button } from "antd";
import FilterDropdown from "./FilterDropdown";
import styled from "@emotion/styled";
import withFilters from "../../filters";
import { FILTERS_ENUM } from "../../constants";

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
  };

  handleApply = () => {
    const { field, operator, text } = this.state.currentAdvFiliter;

    if (!field || !operator || !text) {
      return;
    }

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

  handleClear = () => {
    this.setState({ currentAdvFiliter: {} });
    this.props.onClear();
  };

  render() {
    const { options: advancedFilterOptions } = this.props;
    const { currentAdvFiliter } = this.state;
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
            value={currentAdvFiliter.field}
          />

          <FilterDropdown
            className={FilterDropdownClass}
            data={OPERATORS_TYPES}
            placeholder={
              <FormattedMessage id="workflowFiltersTranslated.selectOperator" />
            }
            name="operator"
            onSelect={this.handleChange("operator")}
            value={currentAdvFiliter.operator}
          />

          <Input
            className={FilterDropdownClass}
            placeholder={this.props.intl.formatMessage({
              id: "workflowFiltersTranslated.inputValue"
            })}
            onChange={e => this.handleChange("text")(e.target.value)}
            value={currentAdvFiliter.text}
          />
        </FilterRow>
        <FilterButtonsContainer>
          <Button onClick={this.handleApply} type="primary">
            Apply
          </Button>
          <Button onClick={this.handleClear}>Clear All</Button>
          <Button onClick={this.props.onClose}>Close</Button>
        </FilterButtonsContainer>
      </div>
    );
  }
}

export default injectIntl(withFilters(AdvancedFilters));

const FilterButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 20px;

  button {
    margin-right: 10px;
  }
`;
