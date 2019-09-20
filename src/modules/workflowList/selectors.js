import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";

// TODO: Remove this later
export const getWorkflowCount = state => state.workflow.count;

export const statusSelector = state => state.workflowList.staticData.statuses;

// TODO: Check for kind_display || label
// TODO: filter using selected kind id
export const statusesForFilterDropdownSelector = createSelector(
  statusSelector,
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

export const selectedStatus = state =>
  state.workflowList.selectedWorkflowFilters.status;
export const selectedRegion = state =>
  state.workflowList.selectedWorkflowFilters.region;
export const selectedBusinessUnit = state =>
  state.workflowList.selectedWorkflowFilters.businessUnit;
