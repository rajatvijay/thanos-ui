import React, { Component } from "react";

import { Modal, Button, Input, Cascader } from "antd";
import DropdownFilter from "./DropdownFilter";
import { connect } from "react-redux";
import InputBox from "./InputBox";
import { css } from "emotion";

const arr = [
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

  onFilterChange = (key, value) => {
    const { applyFilters, handleCancel } = this.props;

    this.setState({ [key]: value }, function() {
      console.log("key", key);
      if (key != "operator" && key != "field" && key != "text") {
        applyFilters(key, value);
        handleCancel();
      }
    });
  };

  // onSelectNested = (arr)=>{

  // const

  // }

  onClear = () => {
    this.setState({
      status: undefined,
      region: undefined,
      business_unit: undefined,
      operator: undefined,
      text: ""
    });
  };

  componentWillUnmount() {
    console.log("dont reset");
    console.log(this.props);
  }

  updateAdvanceFilterTextValue = e => {
    const { value } = e.target;
    this.setState({ text: value });
  };

  onApply = () => {
    const { field, text, operator } = this.state;
    const { applyFilters, handleCancel } = this.props;

    console.log(this.state);
    if (field && text && operator) {
      console.log(field, operator, text);

      applyFilters("advance", `${field}_${operator}_${text}`);
      this.setState({ showError: false });
      handleCancel();
    } else {
      this.setState({ showError: true });
    }
  };

  render() {
    const {
      visible,
      workflowFilterType,
      handleCancel,
      applyFilters,
      fieldOptions
    } = this.props;
    const { statusType, businessType, regionType } = workflowFilterType;
    console.log(this.state);
    const {
      status,
      region,
      business_unit,
      operator,
      text,
      showError
    } = this.state;

    console.log("filed", fieldOptions);

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
          onCancel={handleCancel}
        >
          <div>
            <div style={{ justifyContent: "space-around", display: "flex" }}>
              <span style={{ color: "#138BD6", cursor: "pointer" }}>
                FILTER BY
              </span>
              <span onClick={() => this.onClear()}>CLEAR</span>
            </div>

            <div style={{ margin: 30 }}>
              <DropdownFilter
                value={status}
                name="status"
                data={statusType}
                placeholder="Status"
                onFilterChange={this.onFilterChange}
              />
              <DropdownFilter
                name="region"
                value={region}
                data={regionType.results}
                placeholder="Market"
                onFilterChange={this.onFilterChange}
              />
              <DropdownFilter
                name="business_unit"
                value={business_unit}
                data={businessType.results}
                placeholder="Division"
                onFilterChange={this.onFilterChange}
              />
            </div>
          </div>

          <div>
            <span style={{ marginLeft: 45, color: "#138BD6" }}>
              ADVANCED FILTERS
            </span>

            <div style={{ margin: 30 }}>
              <Cascader
                style={{ width: "100%" }}
                options={fieldOptions}
                onChange={arr =>
                  this.onFilterChange("field", arr[arr.length - 1])
                }
                placeholder="Please select field"
              />

              <DropdownFilter
                data={arr}
                value={operator}
                placeholder="Select Operator"
                name="operator"
                onFilterChange={this.onFilterChange}
              />
              {/* <InputBox
                placeholder="Input Value"
                value={textValue}
                onChange={this.updateAdvanceFilterTextValue}
              /> */}
              <Input
                placeholder="InputValue"
                onChange={e => this.onFilterChange("text", e.target.value)}
              />
            </div>
          </div>

          <div style={{ margin: 30 }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              onClick={() => this.onApply()}
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
  const { workflowFilterType } = state;
  return {
    workflowFilterType
  };
}

export default connect(mapStateToProps)(FilterPopup);
