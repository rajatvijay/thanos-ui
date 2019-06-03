import React, { Component } from "react";
import { Modal, Button, Input, Cascader } from "antd";
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
    showError: false
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

  updateAdvanceFilterTextValue = e => {
    const { value } = e.target;
    this.setState({ text: value });
  };

  onApply = () => {
    const { field, text, operator } = this.state;
    const { applyFilters, onModalClose } = this.props;

    if (field && text && operator) {
      applyFilters("advance", `${field}_${operator}_${text}`);
      this.setState({ showError: false });
      onModalClose();
    } else {
      this.setState({ showError: true });
    }
  };

  getStatusTypes = () => {
    try {
      const allStatuses = this.props.workflowFilterType.statusType;
      const kindId = this.props.workflowKindValue.selectedKindValue.id;
      return allStatuses.filter(status => status.workflow_kind === kindId);
    } catch (e) {
      return [];
    }
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
      operator,
      showError,
      text,
      field
    } = filterState;
    const { businessType, regionType } = workflowFilterType;

    return (
      <div>
        <Modal
          footer={null}
          closable={true}
          visible={visible}
          maskClosable={false}
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
            <div style={{ justifyContent: "space-around", display: "flex" }}>
              <span style={{ color: "#138BD6", cursor: "pointer" }}>
                FILTER BY
              </span>
              <span style={{ cursor: "pointer" }} onClick={this.props.onClear}>
                CLEAR
              </span>
            </div>

            <div style={{ margin: 30 }}>
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

          <div>
            <span style={{ marginLeft: 45, color: "#138BD6" }}>
              ADVANCED FILTERS
            </span>

            <div style={{ margin: 30 }}>
              <Cascader
                value={field}
                style={{ width: "100%" }}
                options={fieldOptions}
                onChange={arr => onFilterChange("field", arr)}
                placeholder="Please select field"
              />

              <DropdownFilter
                data={OPERATORS_TYPES}
                value={operator}
                placeholder="Select Operator"
                name="operator"
                onFilterChange={onFilterChange}
              />

              <Input
                placeholder="Input Value"
                value={text}
                onChange={e => onFilterChange("text", e.target.value)}
              />
            </div>
          </div>

          <div style={{ margin: 30 }}>
            <Button
              style={{ width: "100%" }}
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
