import React, { Component } from "react";
import { Dropdown, Icon } from "antd";
import {
  workflowFiltersActions,
  workflowKindActions
} from "../../../js/actions";
import { connect } from "react-redux";
import { css } from "emotion";
import styled from "@emotion/styled";
import _ from "lodash";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../js/_helpers/intl-helpers";

const FiltersHeading = styled.div`
  height: 40;
  color: white;
  width: 100%;
  fontsize: 16;
  padding: 8px 28px;
  cursor: pointer;
  &:hover {
    background-color: #104775;
  }
`;
const SubMenuHeading = styled.div`
  height: 30px;
  color: rgb(255, 255, 255, 0.5);
  width: 100%;
  padding: 7px 30px 4px 45px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #158bd6;
  }
`;

class FilterDropdown extends Component {
  state = { value: "" };
  componentWillUpdate(nextProps) {
    if (
      nextProps.workflowKind.workflowKind !==
      this.props.workflowKind.workflowKind
    ) {
      const metaValue =
        nextProps.workflowKind.workflowKind &&
        nextProps.workflowKind.workflowKind[0];
      if (metaValue) {
        this.props.dispatch(workflowKindActions.setValue(metaValue));
        this.setState({ value: metaValue.id });
      }
    }
  }

  handleSelectedKind = kind => {
    const id = kind.id;
    const that = this;
    const metaValue = _.find(this.props.workflowKind.workflowKind, item => {
      return item.id === id;
    });
    this.setState({ value: id });
    const payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    const removePayload = { filterType: "stepgroupdef" };
    this.props.dispatch(workflowFiltersActions.removeFilters(removePayload));
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
    this.props.dispatch(workflowKindActions.setValue(metaValue));
    that.fetchGroupData(metaValue.tag);
  };

  handleSelectedSubKind = menu => {
    const id = menu.id;
    console.log(menu);
    // const that = this;
    // const metaValue = _.find(this.props.workflowKind.workflowKind, item => {
    //   return item.id === id;
    // });
    // this.setState({ value: id });
    // const payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    // const removePayload = { filterType: "stepgroupdef" };
    // this.props.dispatch(workflowFiltersActions.removeFilters(removePayload));
    // this.props.dispatch(workflowFiltersActions.setFilters(payload));
    // this.props.dispatch(workflowKindActions.setValue(metaValue));
    // that.fetchGroupData(metaValue.tag);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
  };

  renderDropdownList = selectedKind => {
    // const { selectedSubHeading } = this.state;
    const { fieldTags } = this.props;
    const { workflowKind } = this.props.workflowKind;
    if (workflowKind) {
      return (
        <div
          className={css`
            position: fixed;
            width: 300px;
            background-color: #0a3150;
            max-height: 210px;
            overflow: auto;
            .ant-dropdown-menu-item > div {
              color: rgba(255, 255, 255, 0.5);
            }
            .ant-dropdown-menu-item-active {
              background-color: #104775;
            }
            .ant-dropdown-menu-item-active > div {
              color: white !important;
            }
            .ant-dropdown,
            .ant-dropdown-menu-item {
              padding: 10px 18px;
            }
          `}
        >
          {workflowKind.map(item => {
            return (
              <>
                <div
                  style={{
                    border: "none",
                    color: "white",
                    fontSize: 16
                  }}
                  key={`${item.id}`}
                >
                  <FiltersHeading
                    onClick={() => this.handleSelectedKind(item)}
                    className={`${
                      selectedKind && selectedKind.name === item.name
                        ? "ant-dropdown-menu-item-active"
                        : null
                    }`}
                  >
                    {item.name}
                  </FiltersHeading>
                  {fieldTags.map(menu => {
                    return (
                      <SubMenuHeading
                        onClick={() => this.handleSelectedSubKind(menu)}
                      >
                        {/* to be implemented at the end*/}

                        {/* {selectedSubHeading === menu ? (
                          <div>dadadsds</div>
                        ) : (
                            {menu}
                            )} */}
                        {getIntlBody(menu)}
                      </SubMenuHeading>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
      );
    }
  };

  render() {
    const selectedKind =
      this.state.value &&
      _.find(this.props.workflowKind.workflowKind, item => {
        return item.id === this.state.value;
      });

    return (
      <Dropdown
        trigger={["click"]}
        className={css`
          background-color: #0a3150;
          height: 65px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0px 28px;
          font-size: 17px;
          color: white;
          align-items: center;
          cursor: pointer;
        `}
        overlay={this.renderDropdownList(selectedKind)}
      >
        <div>
          {selectedKind ? (
            <>
              {selectedKind.name} <Icon type="down" />
            </>
          ) : (
            ""
          )}
        </div>
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  const { workflowKind, workflowKindValue } = state;
  return {
    workflowKind,
    selectedKindValue: workflowKindValue.selectedKindValue
  };
}

export default connect(mapStateToProps)(injectIntl(FilterDropdown));
