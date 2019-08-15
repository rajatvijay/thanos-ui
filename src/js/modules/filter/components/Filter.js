import React, { Component } from "react";
import { connect } from "react-redux";
import { authHeader } from "../../../_helpers";

import FilterPopup from "./FilterPopup";
import { workflowFiltersActions, workflowActions } from "../../../actions";
import { Tooltip, Icon } from "antd";
import CreateNew from "./CreateNew";
import { css } from "emotion";
import { apiBaseURL } from "../../../../config";
import { FormattedMessage, injectIntl } from "react-intl";
import IntlTooltip from "../../../components/common/IntlTooltip";

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
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
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

    console.log("applying filter----");
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  removeFilter = key => {
    const payload = {
      filterType: key
    };

    this.props.dispatch(workflowFiltersActions.removeFilters(payload));
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
    this.props.dispatch(workflowActions.clearAll());
    this.handleModalClose();
  };

  changeScoreOrder = order => {
    const isAscending = this.state.sortOrderAsc;
    const isSortingEnabled = this.state.sortingEnabled;
    if (!isSortingEnabled) {
      // Enable the sroting in descending mode
      this.setState({
        sortOrderAsc: false,
        sortingEnabled: true
      });
      return this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: ["-sorting_primary_field"]
        })
      );
    }

    if (isAscending) {
      // Disable the sorting
      this.setState({ sortingEnabled: false });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: []
        })
      );
    } else {
      // Enable sorting in the ascending mode
      this.setState({
        sortOrderAsc: true,
        sortingEnabled: true
      });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: ["sorting_primary_field"]
        })
      );
    }
  };

  evaluateFilter = () => {
    const { displayfilters } = this.state;

    const arr = Object.values(displayfilters);
    if (arr.length) {
      const str = arr.join(",");

      return `: ${str}`;
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
    const { sortingEnabled } = this.state;

    return (
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
            className={css`
              li {
                display: inline-block;
              }
            `}
            style={{
              listStyle: "none",
              color: "#000",
              cursor: "pointer",
              padding: 0,
              marginBottom: 0
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
                      onClick={this.changeScoreOrder}
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
              onClick={() => this.showModal()}
              style={{
                color: "#000000",
                opacity: 0.3,
                letterSpacing: "0.38px",
                lineHeight: "15px",
                fontSize: 13,
                marginRight: 20,
                textTransform: "uppercase"
              }}
            >
              <FormattedMessage id="mainFilterbar.filterText" />
              <span>{this.evaluateFilter()}</span>
              <Icon
                style={{
                  fontSize: 10,
                  marginLeft: 6
                }}
                type="down"
              />
            </li>
          </ul>
          <FilterPopup
            filterState={this.state}
            onModalClose={this.handleModalClose}
            onClear={this.onClear}
            onFilterChange={this.onFilterChange}
            onApply={this.onApply}
            applyFilters={this.applyFilters}
          />
        </div>
        <div>
          <CreateNew />
        </div>
      </div>
    );
  }
}

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
