import React, { Component } from "react";
import { Dropdown, Icon } from "antd";
import { connect } from "react-redux";
import { css } from "emotion";
import styled from "@emotion/styled";
import { injectIntl } from "react-intl";
import { getIntlBody } from "../../../../js/_helpers/intl-helpers";
import { kindsSelector } from "../../selectors";
import withFilters from "../../filters";
import { FILTERS_ENUM } from "../../constants";

class KindDropdown extends Component {
  handleSelectedKind = kind => {
    this.props.addFilters([
      {
        name: FILTERS_ENUM.KIND_FILTER.name,
        value: kind.id,
        key: FILTERS_ENUM.KIND_FILTER.key,
        meta: kind
      }
    ]);
    this.props.removeFilters([FILTERS_ENUM.FIELD_ANSWER_FILTER.name]);
  };

  handleSelectedFieldAnswer = (kind, fieldTag, fieldAnswer) => {
    this.props.addFilters([
      {
        name: FILTERS_ENUM.KIND_FILTER.name,
        value: kind.id,
        key: FILTERS_ENUM.KIND_FILTER.key,
        meta: kind
      },
      {
        name: FILTERS_ENUM.FIELD_ANSWER_FILTER.name,
        key: FILTERS_ENUM.FIELD_ANSWER_FILTER.key,
        value: `${fieldTag.tag}__eq__${fieldAnswer.value}`,
        meta: fieldAnswer
      }
    ]);
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

  // TODO: Fix this
  // lodashGet(this.props, "workflowFilters.kind.meta", null);
  // the above expression has its display name
  // sometimes in the `name` key and sometimes in the `body` key
  getSelectedKindNameKey = () => {
    return this.selectedKind.body ? "body" : "name";
  };

  get selectedKind() {
    return this.props.getSelectedFilterValue(FILTERS_ENUM.KIND_FILTER.name);
  }

  get selectedFieldAnswer() {
    return this.props.getSelectedFilterValue(
      FILTERS_ENUM.FIELD_ANSWER_FILTER.name
    );
  }

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
        <StyledRelativeLi key={fieldAnswer.label}>
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
          <Icon
            data-testid="kind-dropdown-loader"
            style={{ color: "white", fontSize: 24 }}
            type="loading"
          />
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
    workflowKinds: kindsSelector(state)
  };
}

export default connect(mapStateToProps)(injectIntl(withFilters(KindDropdown)));

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
  position: fixed;
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
      data-testid="kinds-dropdonw-check-icon"
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
