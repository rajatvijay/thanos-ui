import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl, authHeader } from "../../../../_helpers";

import FilterPopup from "./FilterPopup";
import {
  workflowFiltersActions,
  
} from "../../../../actions";

import CreateNew from "./CreateNew";

class Filter extends Component {
  state = { visible: false, fieldOptions: [] };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  applyFilters = (key, value) => {
    console.log(value);
    let payload = {
      filterType: key,
      filterValue: [value]
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
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
    const { visible, fieldOptions } = this.state;

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
            fieldOptions={fieldOptions}
            applyFilters={this.applyFilters}
            handleCancel={this.handleCancel}
            visible={visible}
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
