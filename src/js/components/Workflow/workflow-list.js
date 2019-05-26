import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Layout, Pagination } from "antd";
import { workflowActions } from "../../actions";
import _ from "lodash";
import { calculatedData } from "./calculated-data";
import { connect } from "react-redux";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import UserWorkflow from "./user-workflow";
import WorkflowItem from "./WorkflowItem";

const { Content } = Layout;
const { getProcessedData } = calculatedData;
const PAGE_SIZE = 20;

class WorkflowList extends Component {
  handlePageChange = (page, rage) => {
    let param = [{ label: "page", value: page }];
    this.props.dispatch(workflowActions.getAll(param));
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

  render() {
    let that = this;
    const data = this.props.workflow;
    let page = 1;
    if (data.next) {
      page = data.next.split("page=");
      page = parseInt(page[1], 10) - 1;
    } else if (data.previous) {
      page = data.previous.split("page=");
      page = parseInt(page[1], 10) + 1;
    }

    var occurrenceDay = function(occurrence) {
      var today = moment().startOf("day");
      var thisWeek = moment().startOf("week");
      var thisMonth = moment().startOf("month");

      if (moment(occurrence.created_at).isAfter(today)) {
        return "Today";
      }
      if (moment(occurrence.created_at).isAfter(thisWeek)) {
        return "This week";
      }
      if (moment(occurrence.created_at).isAfter(thisMonth)) {
        return "This month";
      }
      return moment(occurrence.created_at).format("MMM");
    };

    const workflowWithHumanReadableRiskRank =
      data.workflow &&
      data.workflow.map((w, i) => ({
        ...w,
        rank: that.getRank(page, i + 1, data.count)
      }));

    var result = _.groupBy(workflowWithHumanReadableRiskRank, occurrenceDay);
    if (this.props.isEmbedded) {
      var result = _.groupBy(data.workflow, occurrenceDay);
    }

    var ListCompletes = _.map(result, (list, key) => {
      var listL = _.map(list, function(item, index) {
        return (
          <WorkflowItem
            rank={item.rank}
            workflow={item}
            key={index}
            kinds={that.props.workflowKind}
            dispatch={that.props.dispatch}
            workflowFilterType={that.props.workflowFilterType}
            onStatusChange={that.onStatusChange}
            statusView={that.props.statusView}
            workflowChildren={that.props.workflowChildren}
            sortingEnabled={that.props.sortingEnabled}
            showFilterMenu={that.props.showFilterMenu}
            fieldExtra={
              that.props.field && that.props.field.definition.extra
                ? that.props.field.definition.extra
                : null
            }
            addComment={that.props.addComment || null}
            showCommentIcon={that.props.showCommentIcon}
            isEmbedded={that.props.isEmbedded}
            expandedWorkflows={that.props.expandedWorkflows}
            config={that.props.config}
          />
        );
      });

      return (
        <span key={key} className="month-group">
          <div className={"h6 grouping-head " + key}>{key}</div>
          <div className="">{listL}</div>
        </span>
      );
    });

    return (
      <div>
        <Content
          style={{
            overflow: "initial",
            padding: this.props.isEmbedded
              ? "0px 26px 15px 20px"
              : "0px 46px 15px 40px"
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
                  defaultCurrent={page ? page : 1}
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
    userWorkflowModal
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren,
    showFilterMenu,
    expandedWorkflows,
    config,
    userWorkflowModal
  };
}

export default connect(mapPropsToState)(WorkflowList);
