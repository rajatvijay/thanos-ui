import React, { Component } from "react";

import { Modal, Button } from "antd";
import DropdownFilter from "./DropdownFilter";
import { connect } from "react-redux";
import InputBox from "./InputBox";

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
    textValue: undefined
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
      textValue: undefined
    });
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
          style={{ maxWidth: 350 }}
          footer={null}
          closable={false}
          visible={visible}
          // onOk={handleOk}
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
              {/* <InputBox /> */}
            </div>
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
