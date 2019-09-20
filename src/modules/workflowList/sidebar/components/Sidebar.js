import React, { Component } from "react";
import { Layout } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import {
  workflowFiltersActions,
  workflowKindActions
} from "../../../../js/actions";
import { connect } from "react-redux";
import { css } from "emotion";
// import { taskQueueCount } from "../sidebarActions";
import { getAllTaskQueuesThunk } from "../../thunks";
import { injectIntl } from "react-intl";
import KindDropdown from "./KindDropdown";

const { Sider } = Layout;

class Sidebar extends Component {
  state = {
    activeFilter: []
  };

  componentDidMount() {
    // TODO: Using service
    // this.props.getAllTaskQueuesThunk();
  }

  // TODO: Use the service method to set filter
  setFilter = () => {
    const payload = {
      filterType: "alert_category",
      filterValue: this.state.activeFilter
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentDidUpdate(prevProps) {
    const { workflowKind, selectedKindValue } = this.props;
    const { workflowKind: prevWorkflowKind } = prevProps;

    // TODO: See of this is required
    if (workflowKind.workflowKind && !prevWorkflowKind.workflowKind) {
      // So, we just got workflow kinds populated.
      // Now, we'll check if there's no selected workflow kind
      // Or if the one selected is not available anymore,
      // in which case, we'll assign a default one.
      if (
        !selectedKindValue ||
        !workflowKind.workflowKind.find(
          workflow => workflow.id === selectedKindValue.id
        )
      ) {
        this.props.dispatch(
          workflowKindActions.setValue(workflowKind.workflowKind[0])
        );
      }
    }
  }

  // TODO: Combine into single setFitler method
  onSelectAlert = value => {
    if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.tag] }, function() {
        this.setFilter();
      });
    }
  };

  // TODO: Combine into single setFitler method
  onSelectTask = value => {
    const payload = {
      filterType: "stepgroupdef",
      filterValue: value ? [value.tag] : []
    };
    if (!!value)
      this.props.dispatch(workflowFiltersActions.setFilters(payload));
    else this.props.dispatch(workflowFiltersActions.removeFilters(payload));
  };

  // TODO: Combine into single setFitler method
  onSelectMyTask = tag => {
    const payload = {
      filterType: "user-step-tag",
      filterValue: tag ? [tag] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  get isMyTaskSelected() {
    return (
      this.props.workflowFilters["user-step-tag"] &&
      this.props.workflowFilters["user-step-tag"].filterValue &&
      this.props.workflowFilters["user-step-tag"].filterValue.length &&
      this.props.workflowFilters["user-step-tag"].filterValue.includes(
        "Assignee"
      )
    );
  }

  render() {
    // const { isError } = this.props.workflowAlertGroupCount;

    return (
      <Sider
        width={300}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#104774"
        }}
      >
        <div
          className={css`
            width: 300px;
            padding-bottom: 100px;
            height: 100%;
            font-family: Cabin;
            min-height: 110vh;
            background: #104775;
            position: fixed;
          `}
        >
          <div className="logo" />

          <KindDropdown />

          <div
            style={{
              backgroundColor: "#104774",
              padding: "5px 0px",
              maxHeight: "80vh",
              overflowY: "scroll"
            }}
            className={css`
              .sidebarList:hover {
                opacity: 0.4;
              }
            `}
          >
            <div>
              {/* <TaskQueueList
                count={this.props.count}
                activeTaskQueue={this.props.workflowFilters}
                taskQueues={this.props.visibleWorkflowGroups}
                loading={this.props.workflowGroupCount.loading}
                onSelectTask={this.onSelectTask}
                onSelectMyTask={this.onSelectMyTask}
                isMyTaskSelected={this.isMyTaskSelected}
              /> */}
            </div>

            {/* TODO: Fix this incrementaly */}
            {/* <div style={{ display: isError ? "none" : "block" }}>
              <AlertList
                alerts={this.props.workflowAlertGroupCount.alert_details}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectAlert={this.onSelectAlert}
              />
            </div> */}
          </div>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind, // TODO: Only used to set the default kind
    workflowFilters,
    workflowKindValue, // TODO: Only for the selected kind
    taskQueueCount // TODO: Only for the count of it
  } = state;
  return {
    workflowKind,
    workflowFilters,
    selectedKindValue: workflowKindValue.selectedKindValue,
    count: 2 // TODO: Add real number
  };
}

export default connect(
  mapStateToProps,
  { getAllTaskQueuesThunk }
)(injectIntl(Sidebar));
