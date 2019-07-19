import React, { Component } from "react";
import { Modal, Button, Input, Cascader, Divider, Icon } from "antd";
import DropdownFilter from "./DropdownFilter";
import { connect } from "react-redux";
import { css } from "emotion";

const OPERATORS_TYPES = [
  { label: "Equal", value: "eq" },
  { label: "Not equal", value: "not_eq" },
  { label: "Has value", value: "is_set" },
  { label: "Contains", value: "contains" },
  { label: "Does not contain", value: "not_contains" }
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

  onClear = () => {
    this.setState({
      status: undefined,
      region: undefined,
      business_unit: undefined,
      operator: undefined,
      text: ""
    });
  };

  //CLEAR ALL ITEMS FROM ADVANCED FILTERS
  onAdvClear = () => {
    this.setState({ advFitlers: [] }, function() {
      this.applyAdvFilters();
    });
    this.props.onModalClose();
  };

  updateAdvanceFilterTextValue = e => {
    const { value } = e.target;
    this.setState({ text: value });
  };

  //ON ADVANCED FILTER APPLY EVENT
  onApply = () => {
    const { field, text, operator } = this.state;
    const { applyFilters, onModalClose } = this.props;
    let advFitlers = this.state.advFitlers;

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
    let { advFitlers } = this.state;
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
    //return this.props.workflowFilterType.statusType;
  };

  onFilterChange = (key, value) => {
    const { operator, text, field } = this.state;
    this.setState({ [key]: value });
  };

  render() {
    const {
      workflowFilterType,
      filterState,
      onFilterChange,
      onClear,
      onModalClose
    } = this.props;

    const {
      visible,
      fieldOptions,
      status,
      region,
      business_unit,
      showError
    } = filterState;

    const { operator, text, field } = this.state;

    const { businessType, regionType } = workflowFilterType;

    return (
      <div>
        <Modal
          footer={null}
          closable={false}
          visible={visible}
          maskClosable={true}
          className={css`
            max-width: 320px;
            .ant-modal-content {
              border-radius: 0;
              padding-left: 0;
              padding-right: 0;
            }
            .ant-modal-body {
              padding-left: 0;
              padding-right: 0;
            }
          `}
          onCancel={onModalClose}
        >
          <div>
            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
                marginLeft: "28px"
              }}
            >
              <span style={{ color: "#138BD6", cursor: "pointer" }}>
                FILTER BY
              </span>
              <span
                style={{ cursor: "pointer", marginRight: "38px" }}
                onClick={this.props.onClear}
              >
                CLEAR
              </span>
            </div>

            <Divider />

            <div style={{ margin: 28 }}>
              <DropdownFilter
                value={status}
                name="status"
                data={this.getStatusTypes()}
                placeholder="Status"
                onFilterChange={onFilterChange}
              />
              <DropdownFilter
                name="region"
                value={region}
                data={regionType.results}
                placeholder="Market"
                onFilterChange={onFilterChange}
              />
              <DropdownFilter
                name="business_unit"
                value={business_unit}
                data={businessType.results}
                placeholder="Division"
                onFilterChange={onFilterChange}
              />
            </div>
          </div>

          <div style={{ marginTop: "46px" }}>
            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
                marginLeft: "28px"
              }}
            >
              <span style={{ color: "#138BD6", cursor: "pointer" }}>
                ADVANCED FILTERS
              </span>
              <span
                style={{ cursor: "pointer", marginRight: "38px" }}
                onClick={this.onAdvClear}
              >
                CLEAR
              </span>
            </div>

            <Divider />
            {this.state.advFitlers.length > 0 ? (
              <div className="advanced-fitlers-list" style={{ margin: 28 }}>
                {this.state.advFitlers.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className="t-12 text-middle text-light  ant-tag v-tag pd-right"
                      style={{
                        wordBreak: "break-word",
                        height: "auto",
                        whiteSpace: "normal"
                      }}
                    >
                      <span
                        title="Remove this filter"
                        className="pd-ard float-right"
                        onClick={e => this.removeAdvFilter(index)}
                      >
                        <Icon type="close" />
                      </span>
                      <span className="pd-right-sm">{item.field}</span>
                      <span className="pd-right-sm">{item.operator}</span>
                      <span className="pd-right-sm">{item.text}</span>
                    </span>
                  );
                })}
              </div>
            ) : null}

            <div style={{ margin: 28 }}>
              <Cascader
                value={field}
                style={{ width: "100%" }}
                options={fieldOptions}
                onChange={arr => this.onFilterChange("field", arr)}
                placeholder="Please select field"
                className={css`
                  .ant-input {
                    padding-left: 0;
                  }
                `}
              />

              <DropdownFilter
                data={OPERATORS_TYPES}
                value={operator}
                placeholder="Select Operator"
                name="operator"
                onFilterChange={this.onFilterChange}
              />

              <Input
                placeholder="Input Value"
                value={text}
                onChange={e => this.onFilterChange("text", e.target.value)}
                style={{ paddingLeft: 0 }}
              />
            </div>
          </div>

          <div style={{ margin: 30, marginBottom: 12 }}>
            <Button
              style={{ width: "100%", borderRadius: 3 }}
              type="primary"
              onClick={this.onApply}
            >
              Apply
            </Button>

            <p
              style={{
                color: "red",
                display: showError ? "block" : "none",
                textAlign: "center"
              }}
            >
              please choose all three fields
            </p>
          </div>
        </Modal>
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

export default connect(mapStateToProps)(FilterPopup);
