import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl, authHeader } from "../../../../_helpers";

import FilterPopup from "./FilterPopup";
import { workflowFiltersActions, workflowActions } from "../../../../actions";

import CreateNew from "./CreateNew";

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
    showError: false
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
    const { applyFilters, onModalClose } = this.props;
    this.setState({ [key]: value }, function() {
      if (key !== "operator" && key !== "field" && key !== "text") {
        this.applyFilters(key, value);
        this.handleModalClose();
      }
    });
  };

  onApply = () => {
    const { field, text, operator } = this.state;
    const { applyFilters, onModalClose } = this.props;

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
    // const { visible, fieldOptions,status,region ,business_unit,operator,text,field,showError} = this.state;

    return (
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          <ul
            style={{
              listStyle: "none",
              fontSize: 14,
              color: "#000",
              cursor: "pointer"
            }}
          >
            <li
              style={{
                display: "inline",
                paddingRight: 10
              }}
            >
              DATE CREATED
            </li>
            <li
              onClick={() => this.showModal()}
              style={{
                display: "inline",
                paddingRight: 10
              }}
            >
              FILTER
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
    showFilterMenu
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(Filter);