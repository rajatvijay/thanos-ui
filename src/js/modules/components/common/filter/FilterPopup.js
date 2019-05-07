import React, { Component } from "react";

import { Modal, Button } from "antd";
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
    statusValue: undefined,
    marketValue: undefined,
    divisionValue: undefined,
    operatorValue: undefined,
    textValue: ""
  };

  onFilterChange = (key, value) => {
    this.setState({ [key]: value });
  };

  onClear = () => {
    this.setState({
      statusValue: undefined,
      marketValue: undefined,
      divisionValue: undefined,
      operatorValue: undefined,
      textValue: ""
    });
  };

  updateAdvanceFilterTextValue = e => {
    const { value } = e.target;
    this.setState({ textValue: value });
  };

  applyFilters = () => {
    console.log("APPLIED FILTERS");
  };

  render() {
    const { visible, workflowFilterType, handleCancel } = this.props;
    const { statusType, businessType, regionType } = workflowFilterType;
    console.log(this.state);
    const {
      statusValue,
      marketValue,
      divisionValue,
      operatorValue,
      textValue
    } = this.state;

    return (
      <div>
        <Modal
          footer={null}
          closable={true}
          visible={visible}
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
                value={statusValue}
                name="statusValue"
                data={statusType}
                placeholder="Status"
                onFilterChange={this.onFilterChange}
              />
              <DropdownFilter
                name="marketValue"
                value={marketValue}
                data={businessType.results}
                placeholder="Market"
                onFilterChange={this.onFilterChange}
              />
              <DropdownFilter
                name="divisionValue"
                value={divisionValue}
                data={regionType.results}
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
              <DropdownFilter
                data={arr}
                value={operatorValue}
                placeholder="Select Operator"
                name="operatorValue"
                onFilterChange={this.onFilterChange}
              />
              <InputBox
                placeholder="Input Value"
                value={textValue}
                onChange={this.updateAdvanceFilterTextValue}
              />
            </div>
          </div>

          <div style={{ margin: 30 }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              onClick={this.applyFilters}
            >
              Apply
            </Button>
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
