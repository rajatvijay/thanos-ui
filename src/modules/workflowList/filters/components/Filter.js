import React, { Component } from "react";
import { connect } from "react-redux";
import { authHeader } from "../../../../js/_helpers";

import FilterPopup from "./FilterPopup";
import {
  workflowFiltersActions,
  workflowActions
} from "../../../../js/actions";
import { Icon } from "antd";
import CreateNew from "./CreateNew";
import { css } from "emotion";
import styled from "@emotion/styled";
import { FormattedMessage, injectIntl } from "react-intl";
import { get as lodashGet } from "lodash";
import { apiBaseURL } from "../../../../config";
import IntlTooltip from "../../../../js/components/common/IntlTooltip";

class Filter extends Component {
  state = {
    visible: false,
    fieldOptions: [],
    status: undefined,
    region: undefined,
    business_unit: undefined,
    operator: undefined,
    text: "",
    field: undefined,
    showError: false,
    sortOrderAsc: false,
    sortingEnabled: false,
    displayfilters: {}
  };

  showModal = () => {
    this.setState({
      visible: !this.state.visible
    });
  };

  handleModalClose = e => {
    this.setState({
      visible: false
    });
  };

  onFilterChange = (key, value) => {
    const { displayfilters = {}, region, business_unit } = this.state;

    const {
      businessType,
      regionType,
      statusType
    } = this.props.workflowFilterType;

    const updatedState = {};

    //ON STATUS CHANGE//
    if (key === "status") {
      const statusObj = statusType.find(item => item.value === value);
      displayfilters.status = statusObj.label;
    }

    //ON REGION CHANGE//
    if (key === "region") {
      const regionObj = regionType.results.find(item => item.value === value);

      if (value !== region && !!business_unit) {
        // if region is changed, make sure to clean the business unit as well.
        updatedState.business_unit = undefined;
        displayfilters.business_unit = undefined;
        this.removeFilter("business_unit");
      }
      this.props.dispatch(
        workflowFiltersActions.getBusinessUnitData(regionObj.value)
      );

      displayfilters.region = regionObj.label;
    }

    //ON BUSINESS UNIT CHANGE//
    if (key === "business_unit") {
      const business_unitObj = businessType.results.find(
        item => item.value === value
      );
      displayfilters.business_unit = business_unitObj.label;
    }

    updatedState[key] = value;
    updatedState.displayfilters = { ...displayfilters };

    this.setState({ ...updatedState }, function() {
      if (key !== "operator" && key !== "field" && key !== "text") {
        this.applyFilters(key, value);
        this.handleModalClose();
      }
    });
  };

  onApply = () => {
    const { field, text, operator } = this.state;

    if (field && text && operator) {
      this.applyFilters(
        "advance",
        `${field[field.length - 1]}_${operator}_${text}`
      );
      this.setState({ showError: false });
      this.handleModalClose();
    } else {
      this.setState({ showError: true });
    }
  };

  applyFilters = (key, value) => {
    const payload = {
      filterType: key,
      filterValue: [value]
    };

    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  removeFilter = key => {
    const payload = {
      filterType: key
    };

    this.props.dispatch(workflowFiltersActions.removeFilters(payload));

    let displayfilters = this.state.displayfilters;
    delete displayfilters[key];

    this.setState({
      displayfilters: displayfilters
    });
  };

  onClear = () => {
    this.setState({
      status: undefined,
      region: undefined,
      business_unit: undefined,
      operator: undefined,
      text: "",
      field: undefined,
      displayfilters: {}
    });
    this.props.dispatch(workflowActions.clear());
    this.handleModalClose();
  };

  removeAdvFilter = () => {
    this.props.dispatch(
      workflowFiltersActions.setFilters({
        filterType: "answer",
        filterValue: []
      })
    );
  };

  evaluateFilter = () => {
    const { displayfilters } = this.state;
    const displayFilterKey = Object.keys(displayfilters);
    const displayFilterValue = Object.values(displayfilters);

    if (displayFilterValue.length) {
      return displayFilterValue.map((filter, index) => {
        return (
          <StyledFilterItem
            onClick={event => this.removeFilter(displayFilterKey[index])}
          >
            <span>{filter}</span>
            <span
              className={css`
                margin-left: 8px;
              `}
            >
              X
            </span>
          </StyledFilterItem>
        );
      });
    }
  };

  evaluateAdvancedFilter = () => {
    const filterValue = lodashGet(
      this.props,
      "workflowFilters.answer.filterValue",
      []
    );

    if (filterValue.length) {
      const fitler = filterValue[0].split("__").join(" ");
      return (
        <StyledFilterItem onClick={this.removeAdvFilter}>
          <span>{fitler}</span>

          <span
            className={css`
              margin-left: 8px;
            `}
          >
            X
          </span>
        </StyledFilterItem>
      );
    } else {
      return;
    }
  };

  componentDidMount() {
    this.fetchAdvFilterData();
  }

  componentDidUpdate = prevProps => {
    if (prevProps.workflowFilters.kind !== this.props.workflowFilters.kind) {
      this.fetchAdvFilterData();
    }
  };

  fetchAdvFilterData = () => {
    const kindName = this.props.workflowFilters.kind.meta.tag;

    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    const url = `${apiBaseURL}fields/export-json/?active_kind=${kindName}`;

    if (kindName) {
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(body => {
          this.setState({ fieldOptions: body.results });
        });
    }
  };

  render() {
    const { sortingEnabled, displayfilters } = this.state;

    const filter = Object.values(displayfilters);
    const filterLength = filter.length;
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #DBDBDB",
            alignItems: "center"
          }}
        >
          <div>
            <ul
              style={{
                listStyle: "none",
                color: "#000",
                cursor: "pointer",
                padding: 0,
                marginBottom: 0,
                display: "flex",
                alignItems: "center"
              }}
            >
              {this.props.workflow.count || this.props.workflow.count === 0 ? (
                <li
                  style={{
                    margin: "0px 30px 0px 0px",
                    color: "#000000",
                    opacity: 0.3,
                    letterSpacing: "0.38px",
                    lineHeight: "15px",
                    fontSize: 13,
                    textTransform: "uppercase"
                  }}
                >
                  {this.props.workflow.count}{" "}
                  <FormattedMessage id="mainFilterbar.resultsText" />
                </li>
              ) : null}

              {/* TODO: Separate as a private component */}
              {this.props.workflow.loading ? null : this.props.workflow
                  .loadingStatus === "failed" ? null : (
                <li
                  style={{
                    margin: "0px 40px 0px 10px",
                    letterSpacing: "0.38px",
                    lineHeight: "15px",
                    fontSize: 13,
                    textTransform: "uppercase"
                  }}
                >
                  {this.props.workflowFilters.kind.meta
                    .is_sorting_field_enabled ? (
                    <IntlTooltip
                      title={
                        this.state.sortOrderAsc
                          ? "tooltips.highToLowRiskScoreText"
                          : "tooltips.lowToHighRiskScoreText"
                      }
                    >
                      <span
                        className="text-secondary text-anchor"
                        onClick={this.props.changeScoreOrder}
                      >
                        <FormattedMessage id="mainFilterbar.riskText" />
                        {sortingEnabled ? (
                          <i className="material-icons t-14  text-middle">
                            {this.state.sortOrderAsc
                              ? "keyboard_arrow_up"
                              : "keyboard_arrow_down"}
                          </i>
                        ) : null}
                      </span>
                    </IntlTooltip>
                  ) : null}
                </li>
              )}
              <li
                style={{
                  color: "#000000",
                  opacity: 0.3,
                  letterSpacing: "0.38px",
                  lineHeight: "15px",
                  fontSize: 13,
                  marginRight: 20,
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span onClick={() => this.showModal()}>
                  <FormattedMessage id="mainFilterbar.filterText" />
                  {!filterLength ? (
                    <Icon
                      style={{
                        fontSize: 10,
                        marginLeft: 6
                      }}
                      type="down"
                    />
                  ) : (
                    ":"
                  )}
                </span>
                <span
                  className={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  {this.evaluateFilter()}
                  {this.evaluateAdvancedFilter()}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <CreateNew />
          </div>
        </div>
        {this.state.visible ? (
          <FilterPopup
            filterState={this.state}
            onModalClose={this.handleModalClose}
            onClear={this.onClear}
            onFilterChange={this.onFilterChange}
            onApply={this.onApply}
            applyFilters={this.applyFilters}
          />
        ) : null}
      </>
    );
  }
}

const StyledFilterItem = styled.div`
  color: #ffffff;
  font-size: 12px;
  letter-spacing: 0.38px;
  line-height: 15px;
  text-align: center;
  background-color: #000000;
  margin-left: 6px;
  padding: 2px 10px;
  cursor: pointer;
`;

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu,
    workflow
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu,
    workflow
  };
}

export default connect(mapStateToProps)(injectIntl(Filter));
