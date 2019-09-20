import React, { Component } from "react";
import { Icon } from "antd";
import FilterPopup from "./FilterPopup";
import { connect } from "react-redux";
import { css } from "emotion";

class WorkflowToolbar extends Component {
  state = {
    isFilterPopupVisible: false
  };
  toggleFilterPopup = () => {
    this.setState(({ isFilterPopupVisible }) => ({
      isFilterPopupVisible: !isFilterPopupVisible
    }));
  };
  render() {
    const { isFilterPopupVisible } = this.state;
    return (
      <div>
        <div>
          <span
            className={css`
              cursor: pointer;
              user-select: none;
            `}
            onClick={this.toggleFilterPopup}
          >
            Filter
            {isFilterPopupVisible ? <Icon type="up" /> : <Icon type="down" />}
          </span>
          {isFilterPopupVisible && <FilterPopup />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // staticData:
  };
};

export default connect(mapStateToProps)(WorkflowToolbar);
