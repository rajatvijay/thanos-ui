import React, { Component } from "react";
import { Modal, Button, Input, Cascader, Divider } from "antd";
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
      const fieldValue = field[field.length - 1];

      applyFilters("answer", `${fieldValue}__${operator}__${text}`);
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
            <span style={{ marginLeft: 28, color: "#138BD6" }}>
              ADVANCED FILTERS
            </span>

            <Divider />

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
