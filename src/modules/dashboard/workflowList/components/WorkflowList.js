import React, { Component } from "react";
import { connect } from "react-redux";
import WorkflowItem from "./WorkflowItem";
import {
  isWorkflowSortingEnabledSelector,
  workflowListCountSelector,
  groupedWorkflowsSelector
} from "../../selectors";
import { css } from "emotion";
import { FILTERS_ENUM } from "../../constants";
import { FormattedMessage } from "react-intl";
import { Icon, Pagination } from "antd";
import withFilters from "../../filters";
import WorkflowDetailsModal from "./WorkflowDetailsModal";

// Hard coding
const PAGE_SIZE = 20;

class WorkflowList extends Component {
  state = {
    workflowDetailsModalVisible: false
  };

  closeWorkflowDetailsModalVisible = () =>
    this.setState({ workflowDetailsModalVisible: false });

  openWorkflowDetailsModalVisible = () =>
    this.setState({ workflowDetailsModalVisible: true });

  handlePageChange = page => {
    this.props.addFilters([
      {
        name: FILTERS_ENUM.PAGE_FILTER.name,
        key: FILTERS_ENUM.PAGE_FILTER.key,
        value: page,
        meta: page
      }
    ]);
  };

  handleWorkflowClick = workflow => e => {
    this.setState({
      currentWorkflow: workflow
    });
    this.openWorkflowDetailsModalVisible();
  };

  renderWorflowItem = workflow => {
    const { isSortingEnabled } = this.props;
    return (
      <WorkflowItem
        showSortingValue={isSortingEnabled}
        workflow={workflow}
        onClick={this.handleWorkflowClick(workflow)}
      />
    );
  };

  renderWorkflows = workflowGoups => {
    return Object.keys(workflowGoups).map(groupTitle => (
      <div
        className={css`
          padding-top: 40px;
          margin-bottom: 40px;

          > span {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.3);
            text-transform: uppercase;
            margin-bottom: 8px;
            display: inline-block;
          }
        `}
      >
        <FormattedMessage id={groupTitle} />
        <div
          className={css`
            box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.05);
          `}
        >
          {workflowGoups[groupTitle].map(this.renderWorflowItem)}
        </div>
      </div>
    ));
  };

  renderLoader = () => {
    return (
      <div
        className={css`
          width: 100%;
          text-align: center;
          padding: 20px;
        `}
      >
        <Icon style={{ fontSize: 24 }} type="loading" />
      </div>
    );
  };

  render() {
    const { isLoading, workflowGroups, workflowCount } = this.props;
    const { workflowDetailsModalVisible, currentWorkflow } = this.state;

    return (
      <div>
        <WorkflowDetailsModal
          visible={workflowDetailsModalVisible}
          workflow={currentWorkflow}
          close={this.closeWorkflowDetailsModalVisible}
        />
        {isLoading ? this.renderLoader() : this.renderWorkflows(workflowGroups)}
        <div>
          {workflowCount > 1 && (
            <Pagination
              className={css`
                margin-top: 40px;
                text-align: center;
              `}
              pageSize={PAGE_SIZE}
              total={workflowCount}
              onChange={this.handlePageChange}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isSortingEnabled: isWorkflowSortingEnabledSelector(state),
  isLoading: state.workflowList.workflowList.isLoading,
  workflowCount: workflowListCountSelector(state),
  workflowGroups: groupedWorkflowsSelector(state)
});

export default connect(mapStateToProps)(withFilters(WorkflowList));
