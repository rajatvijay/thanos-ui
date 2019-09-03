import React, { Component } from "react";
import { Layout, Pagination } from "antd";
import { workflowActions } from "../../actions";
import _ from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import { FormattedMessage, injectIntl } from "react-intl";
import UserWorkflow from "./user-workflow";
import WorkflowItem from "./WorkflowItem";

const { Content } = Layout;
const PAGE_SIZE = 20;

class WorkflowList extends Component {
  handlePageChange = page => {
    const { searchValue } = this.props.workflowSearch;
    const param = [{ label: "page", value: page }];
    if (searchValue) {
      this.props.dispatch(workflowActions.searchWorkflow(searchValue, page));
    } else {
      this.props.dispatch(workflowActions.getAll(param));
    }
  };

  reload = () => {
    this.props.dispatch(workflowActions.getAll());
  };

  getRank = (page, index, count) => {
    const { sortAscending } = this.props;
    if (sortAscending) {
      return (page - 1) * 20 + index;
    } else {
      return count - (page - 1) * 20 - index + 1;
    }
  };

  getWorkflowWithHumaReadableRiskRanking = currentPage => {
    const { workflow } = this.props;
    return (
      workflow.workflow &&
      workflow.workflow.map((w, i) => ({
        ...w,
        rank: this.getRank(currentPage, i + 1, workflow.count)
      }))
    );
  };

  getGroupedWorkflows = currentPage => {
    const { disableGrouping, isEmbedded, workflow } = this.props;
    const workflows = isEmbedded
      ? workflow.workflow
      : this.getWorkflowWithHumaReadableRiskRanking(currentPage);
    if (disableGrouping) {
      return { workflows };
    }
    return _.groupBy(workflows, this.getOccurrenceDay);
  };

  getOccurrenceDay = occurrence => {
    const today = moment().startOf("day");
    const thisWeek = moment().startOf("week");
    const thisMonth = moment().startOf("month");

    if (moment(occurrence.created_at).isAfter(today)) {
      return this.props.intl.formatMessage({ id: "commonTextInstances.today" });
    }
    if (moment(occurrence.created_at).isAfter(thisWeek)) {
      return this.props.intl.formatMessage({
        id: "commonTextInstances.thisWeek"
      });
    }
    if (moment(occurrence.created_at).isAfter(thisMonth)) {
      return this.props.intl.formatMessage({
        id: "commonTextInstances.thisMonth"
      });
    }
    return moment(occurrence.created_at).format("MMM");
  };

  getCurrentPage = () => {
    const workflowData = this.props.workflow;
    let page = 1;
    if (workflowData.next) {
      page = workflowData.next.split("page=");
      page = parseInt(page[1], 10) - 1;
    } else if (workflowData.previous) {
      page = workflowData.previous.split("page=");
      page = parseInt(page[1], 10) + 1;
    }
    return page;
  };

  render() {
    const that = this;
    const data = this.props.workflow;
    const currentPage = this.getCurrentPage();
    const groupedWorkflows = this.getGroupedWorkflows(currentPage);

    const ListCompletes = _.map(groupedWorkflows, (list, key) => {
      const listL = _.map(list, function(item, index) {
        return (
          <WorkflowItem
            location={that.props.location}
            rank={item.rank}
            workflow={item}
            key={`${index}`}
            kinds={that.props.workflowKind}
            dispatch={that.props.dispatch}
            workflowFilterType={that.props.workflowFilterType}
            onStatusChange={that.onStatusChange}
            statusView={that.props.statusView}
            workflowChildren={that.props.workflowChildren}
            sortingEnabled={that.props.sortingEnabled}
            showFilterMenu={that.props.showFilterMenu}
            fieldExtra={that.props.fieldExtra}
            addComment={that.props.addComment || null}
            showCommentIcon={that.props.showCommentIcon}
            isEmbedded={that.props.isEmbedded}
            expandedWorkflows={that.props.expandedWorkflows}
            config={that.props.config}
            bulkActionWorkflowChecked={that.props.bulkActionWorkflowChecked}
            handleChildWorkflowCheckbox={that.props.handleChildWorkflowCheckbox}
          />
        );
      });

      return (
        <span key={key} className="month-group">
          {!this.props.isEmbedded ? (
            <div
              style={{
                marginTop: "38px",
                marginBottom: "11px",
                fontSize: "12px",
                opacity: 0.3,
                color: "#00000",
                fontWeight: "bold",
                letterSpacing: "-0.02px",
                lineHeight: "15px"
              }}
            >
              {key.toUpperCase()}
            </div>
          ) : null}

          <div className="">{listL}</div>
        </span>
      );
    });

    return (
      <div>
        <Content
          style={{
            overflow: "initial",
            padding: 0
          }}
          className="workflow-list-wrapper"
        >
          {data.workflow && data.workflow.length > 0 ? (
            <div>
              <div
                className={
                  "workflow-list " +
                  (_.size(this.props.expandedWorkflows.list)
                    ? "has-Open-workflow  "
                    : " ") +
                  (!this.props.isEmbedded ? " notEmbedded " : " ")
                }
              >
                {ListCompletes}
              </div>
              <div className="mr-top-lg text-center pd-bottom-lg">
                <Pagination
                  style={{
                    display:
                      data.workflow && data.workflow.length < data.count
                        ? "block"
                        : "none"
                  }}
                  pageSize={PAGE_SIZE}
                  defaultCurrent={currentPage ? currentPage : 1}
                  total={data.count}
                  onChange={this.handlePageChange.bind(this)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-medium text-metal">
              {" "}
              <FormattedMessage id="errorMessageInstances.noWorkflowsToShow" />{" "}
              <span
                className="text-underline text-anchor"
                onClick={this.reload}
              >
                <FormattedMessage id="commonTextInstances.reloadText" />
              </span>
            </div>
          )}
          <UserWorkflow
            visible={this.props.userWorkflowModal.visible}
            kinds={this.props.workflowKind}
            parentWorkflowID={this.props.userWorkflowModal.workflowID}
            {...this.props}
          />
        </Content>
      </div>
    );
  }
}

function mapPropsToState(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowChildren,
    showFilterMenu,
    expandedWorkflows,
    config,
    userWorkflowModal,
    workflowSearch
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren,
    showFilterMenu,
    expandedWorkflows,
    config,
    userWorkflowModal,
    workflowSearch
  };
}

export default connect(mapPropsToState)(injectIntl(WorkflowList));
