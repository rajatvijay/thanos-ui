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
import { get as lodashGet } from "lodash";

class FilterDropdown extends Component {
  handleSelectedKind = kind => {
    const kindPayload = {
      filterType: "kind",
      filterValue: [kind.id],
      meta: kind
    };
    this.clearOtherFitlers(["field_def_tags", "stepgroupdef"]);
    this.props.dispatch(workflowFiltersActions.setFilters(kindPayload));
    this.props.dispatch(workflowKindActions.setValue(kind));
    this.fetchSidebarMeta(kind.tag);
  };

  handleSelectedSubKind = (kind, subKind) => {
    const { id: kindId } = kind;
    const { tag } = subKind;

    const fieldTagPayload = {
      filterType: "field_def_tags",
      filterValue: [tag],
      meta: subKind
    };
    const kindPayload = {
      filterType: "kind",
      filterValue: [kindId],
      meta: subKind
    };
    this.clearOtherFitlers(["stepgroupdef"]);
    this.props.dispatch(workflowFiltersActions.setFilters(fieldTagPayload));
    this.props.dispatch(workflowFiltersActions.setFilters(kindPayload));
    this.props.dispatch(workflowKindActions.setValue(subKind));
    this.fetchSidebarMeta(kind.tag);
  };

  clearOtherFitlers = filters => {
    filters.forEach(filterType => {
      this.props.dispatch(workflowFiltersActions.removeFilters({ filterType }));
    });
  };

  // TODO: This should be inside a thunk,
  // The behaviour is of a pub-sub pattern
  // when one action is dispatched
  // dispatch these set of actions
  fetchSidebarMeta = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
  };

  isSubKindSelected = subkind => {
    return this.selectedSubKind && this.selectedSubKind.id === subkind.id;
  };

  isKindSelected = kind => {
    return this.selectedKind && this.selectedKind.id === kind.id;
  };

  renderDropdownList = () => {
    const { workflowKind } = this.props.workflowKind;

    return (
      <StyledListContainer>
        {workflowKind.map(kind => (
          <StyledRelativeLi>
            <FiltersHeading onClick={() => this.handleSelectedKind(kind)}>
              {kind.name}
            </FiltersHeading>
            {this.isKindSelected(kind) && <StyledPostionedCheckIndicator />}
            {
              <ul
                className={css`
                  list-style-type: none;
                  padding: 0;
                `}
              >
                {kind.field_tags_for_filter.map(fieldTag => (
                  <StyledRelativeLi>
                    <SubMenuHeading
                      onClick={() => this.handleSelectedSubKind(kind, fieldTag)}
                    >
                      {getIntlBody(fieldTag)}
                    </SubMenuHeading>
                    {this.isSubKindSelected(fieldTag) && (
                      <StyledPostionedCheckIndicator />
                    )}
                  </StyledRelativeLi>
                ))}
              </ul>
            }
          </StyledRelativeLi>
        ))}
      </StyledListContainer>
    );
  };

  get selectedSubKind() {
    return lodashGet(this.props, "workflowFilters.field_def_tags.meta", null);
  }

  get selectedKind() {
    console.log(lodashGet(this.props, "workflowFilters.kind.meta", null));
    return lodashGet(this.props, "workflowFilters.kind.meta", null);
  }

  // TODO: Fix this
  // lodashGet(this.props, "workflowFilters.kind.meta", null);
  // the above expression has its display name
  // sometimes in the `name` key and sometimes in the `body` key
  getSelectedKindNameKey = () => {
    return this.selectedKind.body ? "body" : "name";
  };

  renderSelectedItem = () => {
    return (
      <StyledSelectedItemContianer>
        {this.selectedKind ? (
          <>
            <div
              className={css`
                display: flex;
                align-items: center;
              `}
            >
              {getIntlBody(this.selectedKind, this.getSelectedKindNameKey())}
              {this.selectedSubKind ? (
                <span
                  className={css`
                    height: 100%;
                    align-items: center;
                    margin-left: 10px;
                    font-size: 14px;
                    color: rgb(255, 255, 255, 0.5);
                  `}
                >
                  {getIntlBody(this.selectedSubKind)}
                </span>
              ) : null}
            </div>
            <Icon type="down" />
          </>
        ) : (
          ""
        )}
      </StyledSelectedItemContianer>
    );
  };

  get loading() {
    return lodashGet(this.props, "workflowKind.loading", false);
  }

  render() {
    const { workflowKind } = this.props.workflowKind;

    if (!workflowKind) {
      return null;
    }

    if (this.loading) {
      return <Icon type="loading" />;
    }

    return (
      <Dropdown trigger={["click"]} overlay={this.renderDropdownList()}>
        {this.renderSelectedItem()}
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  const { workflowKind, workflowKindValue, workflowFilters } = state;
  return {
    workflowKind,
    selectedKindValue: workflowKindValue.selectedKindValue,
    workflowFilters
  };
}

export default connect(mapStateToProps)(injectIntl(FilterDropdown));

// ================================================================================ //
// ================================================================================ //
// ================================================================================ //
// ================================================================================ //

const FiltersHeading = styled.div`
  font-size: 15px;
  padding: 8px 28px;
  cursor: pointer;
  &:hover {
    background-color: #104775;
  }
`;
const SubMenuHeading = styled.div`
  font-size: 14px;
  padding: 8px 28px;
  cursor: pointer;
  &:hover {
    background-color: #104775;
  }
  color: rgb(255, 255, 255, 0.5);
  padding: 8px 38px;
`;

const StyledListContainer = styled.ul`
  background-color: #0a3150;
  max-height: 250px;
  overflow: scroll;
  color: white;
  list-style-type: none;
  padding: 0;
  width: 300px;
`;

const StyledRelativeLi = styled.li`
  position: relative;
`;

const StyledSelectedItemContianer = styled.div`
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
`;

const StyledPostionedCheckIndicator = () => {
  return (
    <Icon
      className={css`
        position: absolute;
        top: 10px;
        right: 20px;
        color: #148cd6;
        font-weight: bold;
        font-size: 20px;
      `}
      type="check"
    />
  );
};
