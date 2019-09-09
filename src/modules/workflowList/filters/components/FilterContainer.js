import React, { Component } from "react";
import { connect } from "react-redux";
import { css } from "emotion";
import { FormattedMessage, injectIntl } from "react-intl";
import { Icon } from "antd";

// FIXME: Relative imports should not be this level deep
import IntlTooltip from "../../../../js/components/common/IntlTooltip";

import { getWorkflowCount } from "../../selectors";
import CreateNew from "./CreateNew";
import FilterPopup from "./FilterPopup";

class FilterContainer extends Component {
  state = {
    filterModalVisible: false
  };
  get showWorkflowCount() {
    const { workflowCount } = this.props;
    return workflowCount || workflowCount === 0;
  }
  toggleFilterModal = () => {
    this.setState(({ filterModalVisible }) => ({
      filterModalVisible: !filterModalVisible
    }));
  };
  render() {
    const { workflowCount } = this.props;
    const { filterModalVisible } = this.state;
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #DBDBDB",
            alignItems: "center"
          }}
        >
          <div>
            <ul
              className={css`
                li {
                  display: inline-block;
                }
              `}
              style={{
                listStyle: "none",
                color: "#000",
                cursor: "pointer",
                padding: 0,
                marginBottom: 0
              }}
            >
              {/* TODO: Also show when count is 0 */}
              {this.showWorkflowCount ? (
                <li
                  style={{
                    margin: "0px 30px 0px 0px",
                    color: "#000000",
                    opacity: 0.3,
                    letterSpacing: "0.38px",
                    lineHeight: "15px",
                    fontSize: 13,
                    textTransform: "uppercase"
                  }}
                >
                  {workflowCount}{" "}
                  <FormattedMessage id="mainFilterbar.resultsText" />
                </li>
              ) : null}

              {/* TODO: Separate as a private component */}
              {this.props.workflow.loading ? null : this.props.workflow
                  .loadingStatus === "failed" ? null : (
                <li
                  style={{
                    margin: "0px 40px 0px 10px",
                    letterSpacing: "0.38px",
                    lineHeight: "15px",
                    fontSize: 13,
                    textTransform: "uppercase"
                  }}
                >
                  {this.props.workflowFilters.kind.meta
                    .is_sorting_field_enabled ? (
                    <IntlTooltip
                      title={
                        this.state.sortOrderAsc
                          ? "tooltips.highToLowRiskScoreText"
                          : "tooltips.lowToHighRiskScoreText"
                      }
                    >
                      <span
                        className="text-secondary text-anchor"
                        onClick={this.changeScoreOrder}
                      >
                        <FormattedMessage id="mainFilterbar.riskText" />
                        {sortingEnabled ? (
                          <i className="material-icons t-14  text-middle">
                            {this.state.sortOrderAsc
                              ? "keyboard_arrow_up"
                              : "keyboard_arrow_down"}
                          </i>
                        ) : null}
                      </span>
                    </IntlTooltip>
                  ) : null}
                </li>
              )}
              <li
                onClick={this.toggleFilterModal}
                style={{
                  color: "#000000",
                  opacity: 0.3,
                  letterSpacing: "0.38px",
                  lineHeight: "15px",
                  fontSize: 13,
                  marginRight: 20,
                  textTransform: "uppercase"
                }}
              >
                <FormattedMessage id="mainFilterbar.filterText" />
                <span>{this.evaluateFilter()}</span>
                <Icon
                  style={{
                    fontSize: 10,
                    marginLeft: 6
                  }}
                  type="down"
                />
              </li>
            </ul>
          </div>
          <div>
            <CreateNew />
          </div>
        </div>
        {filterModalVisible && (
          <FilterPopup
            //TODO: Why all of the state is passed?
            filterState={this.state}
            onModalClose={this.toggleFilterModal}
            onClear={this.onClear}
            onFilterChange={this.onFilterChange}
            // FIXME: Why there are 2 apply?
            onApply={this.onApply}
            applyFilters={this.applyFilters}
          />
        )}
      </>
    );
  }
}

// function mapStateToProps(state) {
//   const {
//     workflowKind,
//     workflowFilterType,
//     workflowFilters,
//     config,
//     languageSelector,
//     showFilterMenu,
//     workflow
//   } = state;
//   return {
//     workflowKind,
//     workflowFilterType,
//     workflowFilters,
//     config,
//     languageSelector,
//     showFilterMenu,
//     workflow
//   };
// }

const mapStateToProps = state => ({
  workflowCount: getWorkflowCount(state)
});

export default connect(mapStateToProps)(injectIntl(FilterContainer));
