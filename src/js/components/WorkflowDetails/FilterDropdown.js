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

class FilterDropdown extends Component {
  state = {
    value: "",
    selectedSubKind: { label: "", value: "" }
  };
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
    if (this.state.value !== kind.id) {
      this.setState({ value: id, selectedSubKind: "" });
    }

    const payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    const removePayload = { filterType: "stepgroupdef" };
    this.props.dispatch(workflowFiltersActions.removeFilters(removePayload));
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
    this.props.dispatch(workflowKindActions.setValue(metaValue));
    that.fetchGroupData(metaValue.tag);
  };

  handleSelectedSubKind = (kind, menu) => {
    const id = kind.id;
    const tag = menu.tag;
    const that = this;

    const payload = {
      filterType: "field_def_tags",
      filterValue: [tag],
      meta: menu
    };
    this.setState({
      value: id,
      selectedSubKind: {
        ...this.state.selectedSubKind,
        label: menu.id,
        value: getIntlBody(menu)
      }
    });
    const payload1 = { filterType: "kind", filterValue: [id], meta: menu };
    const removePayload = { filterType: "stepgroupdef" };
    this.props.dispatch(workflowFiltersActions.removeFilters(removePayload));
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
    this.props.dispatch(workflowFiltersActions.setFilters(payload1));
    this.props.dispatch(workflowKindActions.setValue(menu));
    that.fetchGroupData(kind.tag);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
  };

  renderDropdownList = selectedKind => {
    const { selectedSubKind } = this.state;
    const { workflowKind } = this.props.workflowKind;

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
                {item.field_tags_for_filter.map(menu => {
                  return (
                    <SubMenuHeading
                      onClick={() => this.handleSelectedSubKind(item, menu)}
                    >
                      {/* to be implemented at the end*/}

                      <div
                        className={
                          selectedSubKind.label === menu.id
                            ? "active-sub-kind"
                            : null
                        }
                      >
                        <div
                          className={css`
                            display: flex;
                            justify-content: space-between;
                          `}
                        >
                          <span>{getIntlBody(menu)}</span>
                          <span>
                            {selectedSubKind.label === menu.id ? (
                              <Icon type="check" />
                            ) : null}
                          </span>
                        </div>
                      </div>
                    </SubMenuHeading>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
    );
  };

  render() {
    const selectedKind =
      this.state.value &&
      _.find(this.props.workflowKind.workflowKind, item => {
        return item.id === this.state.value;
      });
    const { selectedSubKind } = this.state;
    const { workflowKind } = this.props.workflowKind;
    return workflowKind ? (
      <Dropdown
        trigger={["click"]}
        className={css`
          background-color: #0a3150;
          min-height: 65px;
          width: 100%;
          padding: 0px 28px;
          font-size: 17px;
          color: white;
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        `}
        overlay={this.renderDropdownList(selectedKind)}
      >
        <div>
          {selectedKind ? (
            <>
              <div
                className={css`
                  display: flex;
                  align-items: center;
                `}
              >
                {selectedKind.name}
                <span
                  className={css`
                    height: 100%;
                    align-items: center;
                    margin-left: 10px;
                    font-size: 14px;
                    color: rgb(255, 255, 255, 0.5);
                  `}
                >
                  {selectedSubKind.value}
                </span>
              </div>
              <Icon type="down" />
            </>
          ) : (
            ""
          )}
        </div>
      </Dropdown>
    ) : null;
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

const FiltersHeading = styled.div`
  height: 40;
  color: white;
  width: 100%;
  font-size: 16;
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
  padding: 7px 40px 4px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #158bd6;
  }
  div.active-sub-kind {
    color: #158bd6;
  }
`;
