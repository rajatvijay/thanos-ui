import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl, authHeader } from "../../../../_helpers";

import FilterPopup from "./FilterPopup";
import { workflowFiltersActions, workflowActions } from "../../../../actions";
import { Tooltip, Icon } from "antd";
import CreateNew from "./CreateNew";
import { css } from "emotion";

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
    const { displayfilters, status, region, business_unit } = this.state;

    const {
      businessType,
      regionType,
      statusType
    } = this.props.workflowFilterType;

    if (key == "status") {
      let statusObj = statusType.find(item => item.value == value);
      displayfilters.status = statusObj.label;
    }
    if (key == "region") {
      let regionObj = regionType.results.find(item => item.value == value);

      displayfilters.region = regionObj.label;
    }
    if (key == "business_unit") {
      let business_unitObj = businessType.results.find(
        item => item.value == value
      );
      displayfilters.business_unit = business_unitObj.label;
    }

    this.setState({ [key]: value, displayfilters }, function() {
      if (key !== "operator" && key !== "field" && key !== "text") {
        this.applyFilters(key, value);
        this.handleModalClose();
      }
    });
  };

  onApply = () => {
    const { field, text, operator } = this.state;
    // const { applyFilters, onModalClose } = this.props;

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

  onClear = () => {
    const { getAllWorkflow, onModalClose } = this.props;

    this.setState({
      status: undefined,
      region: undefined,
      business_unit: undefined,
      operator: undefined,
      text: "",
      field: undefined
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
      let str = arr.join(",");

      return `: ${str}`;
    }
  };

  componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    fetch(baseUrl + "fields/export-json/?active_kind=True", requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({ fieldOptions: body.results });
      });
  }

  render() {
    const { sortingEnabled } = this.state;

    // const { visible, fieldOptions,status,region ,business_unit,operator,text,field,showError} = this.state;

    return (
      <div
        style={{
          marginTop: 60,
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #DBDBDB",
          margin: "20px 40px 0px 40px",
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
              fontSize: 14,
              color: "#000",
              cursor: "pointer",
              padding: 0
            }}
          >
            {this.props.workflow.count || this.props.workflow.count === 0 ? (
              <li style={{ margin: "0px 10px 0px 0px", color: "#C8C8C8" }}>
                {this.props.workflow.count} Results
              </li>
            ) : null}

            {/* TODO: Separate as a private component */}
            {this.props.workflow.loading ? null : this.props.workflow
              .loadingStatus === "failed" ? null : (
              <li style={{ margin: "0px 20px 0px 10px" }}>
                {this.props.workflowFilters.kind.meta
                  .is_sorting_field_enabled ? (
                  <Tooltip
                    // TODO: Use destructuring, dont access state directly inside any method
                    title={
                      this.state.sortOrderAsc
                        ? "High to low risk score"
                        : "Low to high risk score"
                    }
                  >
                    <span
                      className="text-secondary text-anchor"
                      onClick={this.changeScoreOrder}
                    >
                      Risk
                      {sortingEnabled ? (
                        <i className="material-icons t-14  text-middle">
                          {this.state.sortOrderAsc
                            ? "keyboard_arrow_up"
                            : "keyboard_arrow_down"}
                        </i>
                      ) : null}
                    </span>
                  </Tooltip>
                ) : null}
              </li>
            )}
            <li
              onClick={() => this.showModal()}
              style={{
                // color: "#C8C8C8",
                marginRight: 20
              }}
            >
              FILTER
              <span>{this.evaluateFilter()}</span>
              <Icon
                style={{
                  fontSize: 11,
                  marginLeft: 5
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

export default connect(mapStateToProps)(Filter);
