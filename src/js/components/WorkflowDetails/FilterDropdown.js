import React, { Component } from "react";
import { Dropdown, Icon } from "antd";
import {
  workflowFiltersActions,
  workflowKindActions
} from "../../../js/actions";
import { connect } from "react-redux";
import { css } from "emotion";
import styled from "@emotion/styled";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../js/_helpers/intl-helpers";
import { get as lodashGet } from "lodash";

class FilterDropdown extends Component {
  handleSelectedKind = kind => {
    const kindFilter = {
      filterType: "kind",
      filterValue: [kind.id],
      meta: kind
    };
    this.clearFitlers(["stepgroupdef", "answer"]);
    this.applyFilters([kindFilter]);
    this.fetchSidebarMeta(kind.tag);
  };

  handleSelectedFieldAnswer = (kind, fieldTag, fieldAnswer) => {
    const kindFitler = {
      filterType: "kind",
      filterValue: [kind.id],
      meta: kind
    };
    const fieldAnswerFitler = {
      filterType: "answer",
      filterValue: [`${fieldTag.tag}__eq__${fieldAnswer.value}`],
      meta: fieldAnswer
    };
    this.clearFitlers(["stepgroupdef"]);
    this.applyFilters([kindFitler, fieldAnswerFitler]);
    this.fetchSidebarMeta(kind.tag);
  };

  clearFitlers = filters => {
    filters.forEach(filterType => {
      this.props.dispatch(workflowFiltersActions.removeFilters({ filterType }));
    });
  };

  applyFilters = filters => {
    filters.forEach(filter => {
      this.props.dispatch(workflowFiltersActions.setFilters(filter));
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

  isFieldAnswerSelected = fieldAnswer => {
    return (
      this.selectedFieldAnswer &&
      this.selectedFieldAnswer.value === fieldAnswer.value
    );
  };

  isKindSelected = kind => {
    return (
      this.selectedKind &&
      this.selectedKind.id === kind.id &&
      !this.selectedFieldAnswer
    );
  };

  // All gettters and setters
  get selectedFieldTag() {
    return lodashGet(this.props, "workflowFilters.field_def_tags.meta", null);
  }

  get selectedKind() {
    return lodashGet(this.props, "workflowFilters.kind.meta", null);
  }

  get selectedFieldAnswer() {
    return lodashGet(this.props, "workflowFilters.answer.meta", null);
  }

  get loading() {
    return lodashGet(this.props, "workflowKind.loading", false);
  }

  // TODO: Fix this
  // lodashGet(this.props, "workflowFilters.kind.meta", null);
  // the above expression has its display name
  // sometimes in the `name` key and sometimes in the `body` key
  getSelectedKindNameKey = () => {
    return this.selectedKind.body ? "body" : "name";
  };

  // All render methods
  renderSelectedItem = () => {
    return (
      <StyledSelectedItemContianer>
        {this.selectedKind ? (
          <>
            <div>
              {getIntlBody(this.selectedKind, this.getSelectedKindNameKey())}
              {this.selectedFieldAnswer && this.renderSelectedFieldAnswer()}
            </div>
            <Icon type="down" />
          </>
        ) : (
          ""
        )}
      </StyledSelectedItemContianer>
    );
  };

  renderSelectedFieldAnswer = () => {
    return (
      <span
        className={css`
          height: 100%;
          align-items: center;
          margin-left: 10px;
          font-size: 14px;
          color: rgb(255, 255, 255, 0.5);
        `}
      >
        {this.selectedFieldAnswer.label}
      </span>
    );
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
            <ul
              className={css`
                list-style-type: none;
                padding: 0;
              `}
            >
              {this.renderFieldAnswerList(kind.field_tags_for_filter, kind)}
            </ul>
          </StyledRelativeLi>
        ))}
      </StyledListContainer>
    );
  };

  renderFieldAnswerList = (fieldTags, kind) => {
    return fieldTags.map(fieldTag =>
      getIntlBody(fieldTag, "extra").map(fieldAnswer => (
        <StyledRelativeLi>
          <SubMenuHeading
            onClick={() =>
              this.handleSelectedFieldAnswer(kind, fieldTag, fieldAnswer)
            }
          >
            {fieldAnswer.label}
          </SubMenuHeading>
          {this.isFieldAnswerSelected(fieldAnswer) && (
            <StyledPostionedCheckIndicator />
          )}
        </StyledRelativeLi>
      ))
    );
  };

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
