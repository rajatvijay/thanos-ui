import React, { Component } from "react";
import { Dropdown, Icon } from "antd";
import { connect } from "react-redux";
import { css } from "emotion";
import styled from "@emotion/styled";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../../js/_helpers/intl-helpers";
import { getAllKindsThunk, applyWorkflowFilterThunk } from "../../thunks";
import {
  kindsSelector,
  selectedKindSelector,
  selectedFieldAnswerSelector
} from "../../selectors";

class KindDropdown extends Component {
  // TODO: Move this to main components/index.js
  // since get of all the general data should be called inside the main component
  componentDidMount() {
    this.props.getAllKindsThunk();
  }

  handleSelectedKind = kind => {
    this.props.applyWorkflowFilterThunk({ field: "kind", value: kind });
  };

  // TODO: Use this when making the filter API call
  // `${fieldTag.tag}__eq__${fieldAnswer.value}`
  handleSelectedFieldAnswer = (kind, fieldTag, fieldAnswer) => {
    this.props.applyWorkflowFilterThunk({ field: "kind", value: kind });
    this.props.applyWorkflowFilterThunk({
      field: "answer",
      value: {
        fieldTag,
        fieldAnswer
      }
    });
  };

  // TODO: This should be inside a thunk,
  // TODO: This should be inside the `Sidebar` compoentn
  // The behaviour is of a pub-sub pattern
  // when one action is dispatched
  // dispatch these set of actions
  // fetchSidebarMeta = tag => {
  // this.props.dispatch(workflowKindActions.getCount(tag));
  // this.props.dispatch(workflowKindActions.getAlertCount(tag));
  // };

  isFieldAnswerSelected = fieldAnswer => {
    const { selectedFieldAnswer } = this.props;
    return (
      selectedFieldAnswer && selectedFieldAnswer.value === fieldAnswer.value
    );
  };

  isKindSelected = kind => {
    const { selectedKind, selectedFieldAnswer } = this.props;
    return selectedKind && selectedKind.id === kind.id && !selectedFieldAnswer;
  };

  // TODO: Fix this
  // lodashGet(this.props, "workflowFilters.kind.meta", null);
  // the above expression has its display name
  // sometimes in the `name` key and sometimes in the `body` key
  getSelectedKindNameKey = () => {
    const { selectedKind } = this.props;
    return selectedKind.body ? "body" : "name";
  };

  // All render methods
  renderSelectedItem = () => {
    const { selectedKind, selectedFieldAnswer } = this.props;
    return (
      <StyledSelectedItemContianer>
        {selectedKind ? (
          <>
            <div>
              {getIntlBody(selectedKind, this.getSelectedKindNameKey())}
              {selectedFieldAnswer && this.renderSelectedFieldAnswer()}
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
    const { selectedFieldAnswer } = this.props;
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
        {selectedFieldAnswer.label}
      </span>
    );
  };

  renderDropdownList = () => {
    const { workflowKinds } = this.props;

    return (
      <StyledListContainer>
        {workflowKinds.data.results.map(kind => (
          <StyledRelativeLi key={kind.id}>
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
    return fieldTags.map(fieldTag => {
      const extra = getIntlBody(fieldTag, "extra");
      if (!extra.length || !Object.keys(extra).length) return null;
      return extra.map(fieldAnswer => (
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
      ));
    });
  };

  render() {
    const { workflowKinds } = this.props;

    // Loading state
    if (workflowKinds.isLoading) {
      return (
        <div
          className={css`
            width: 100%;
            text-align: center;
            padding: 20px;
          `}
        >
          <Icon style={{ color: "white", fontSize: 24 }} type="loading" />
        </div>
      );
    }

    // Just in case backend sends no data
    if (!workflowKinds.data) {
      return null;
    }

    // The main component :smile:
    return (
      <Dropdown trigger={["click"]} overlay={this.renderDropdownList()}>
        {this.renderSelectedItem()}
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  return {
    workflowKinds: kindsSelector(state),
    selectedKind: selectedKindSelector(state),
    selectedFieldAnswer: selectedFieldAnswerSelector(state)
  };
}

export default connect(
  mapStateToProps,
  { getAllKindsThunk, applyWorkflowFilterThunk }
)(injectIntl(KindDropdown));

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
