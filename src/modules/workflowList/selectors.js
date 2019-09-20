import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";

// TODO: Remove this later
export const getWorkflowCount = state => state.workflow.count;

export const statusesSelector = state => state.workflowList.staticData.statuses;

// TODO: Check for kind_display || label
// TODO: filter using selected kind id
export const statusesForFilterDropdownSelector = createSelector(
  statusesSelector,
  statuses => {
    return Array.isArray(statuses.data)
      ? {
          ...statuses,
          data: statuses.data.map(status => ({
            label: status.label,
            value: status.id
          }))
        }
      : statuses;
  }
);

export const selectedStatusSelector = state =>
  state.workflowList.selectedWorkflowFilters.status;
export const selectedRegionSelector = state =>
  state.workflowList.selectedWorkflowFilters.region;
export const selectedBusinessUnitSelector = state =>
  state.workflowList.selectedWorkflowFilters.businessUnit;

export const selectedBasicFiltersSelector = createSelector(
  selectedStatusSelector,
  selectedRegionSelector,
  selectedBusinessUnitSelector,
  (status, region, businessUnit) => {
    return { status, region, businessUnit };
  }
);

export const kindsSelector = state => state.workflowList.kinds;
export const selectedKindSelector = state =>
  state.workflowList.selectedWorkflowFilters.kind;

export const selectedFieldAnswerSelector = state =>
  lodashGet(
    state,
    "workflowList.selectedWorkflowFilters.answer.fieldAnswer",
    null
  );

export const taskQueuesSelector = state => state.workflowList.taskQueues;
export const alertsSelector = state => state.workflowList.alerts;

export const selectedTaskQueuesSelector = state =>
  state.workflowList.selectedWorkflowFilters.taskQueues;
export const selectedAlertsSelector = state =>
  state.workflowList.selectedWorkflowFilters.alerts;
export const isMyTaskSelectedSelector = state =>
  !!state.workflowList.selectedWorkflowFilters.myTask;
