import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";
import {
  TASK_QUEUE_FILTER_NAME,
  ALERTS_FILTER_NAME,
  MY_TASK_FILTER_NAME,
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME
} from "./constants";

// TODO: Remove this later
export const getWorkflowCount = state => state.workflow.count;

export const statusesSelector = state => state.workflowList.staticData.statuses;

export const selectedKindSelector = state =>
  state.workflowList.selectedWorkflowFilters.kind;

// TODO: Check for kind_display || label
// TODO: filter using selected kind id
export const statusesForFilterDropdownSelector = createSelector(
  statusesSelector,
  selectedKindSelector,
  (statuses, kind) => {
    const statusesData = Array.isArray(statuses.data)
      ? kind
        ? kind.available_statuses
            .map(statusId =>
              statuses.data.find(status => status.id === statusId)
            )
            .sort((a, b) =>
              a.label > b.label ? 1 : a.label < b.label ? -1 : 0
            )
        : statuses.data.map(status => ({
            label: status.label,
            value: status.id
          }))
      : statuses.data;
    return {
      ...statuses,
      data: statusesData
    };
  }
);

export const selectedStatusSelector = state => {
  return lodashGet(
    state,
    `workflowList.selectedWorkflowFilters[${STATUS_FILTER_NAME}].value`
  );
};
export const selectedRegionSelector = state => {
  return lodashGet(
    state,
    `workflowList.selectedWorkflowFilters[${REGION_FILTER_NAME}].value`
  );
};
export const selectedBusinessUnitSelector = state => {
  return lodashGet(
    state,
    `workflowList.selectedWorkflowFilters[${BUSINESS_UNIT_FILTER_NAME}].value`
  );
};

export const selectedBasicFiltersSelector = createSelector(
  selectedStatusSelector,
  selectedRegionSelector,
  selectedBusinessUnitSelector,
  (status, region, businessUnit) => {
    // Removing the keys with undefined values
    return JSON.parse(JSON.stringify({ status, region, businessUnit }));
  }
);

export const kindsSelector = state => state.workflowList.kinds;

export const selectedFieldAnswerSelector = state =>
  lodashGet(
    state,
    "workflowList.selectedWorkflowFilters.answer.fieldAnswer",
    null
  );

export const taskQueuesSelector = state => state.workflowList.taskQueues;
export const alertsSelector = state => state.workflowList.alerts;

export const selectedTaskQueuesSelector = state =>
  state.workflowList.selectedWorkflowFilters[TASK_QUEUE_FILTER_NAME];
export const selectedAlertsSelector = state =>
  state.workflowList.selectedWorkflowFilters[ALERTS_FILTER_NAME];
export const isMyTaskSelectedSelector = state =>
  !!state.workflowList.selectedWorkflowFilters[MY_TASK_FILTER_NAME];

export const regionPlaceholderSelector = state => {
  return lodashGet(
    state,
    "config.custom_ui_labels.filterPlaceholders.Region",
    null
  );
};
export const businessUnitPlaceholderSelector = state => {
  return lodashGet(
    state,
    "config.custom_ui_labels.filterPlaceholders.Business",
    null
  );
};

export const workflowCountSelector = state =>
  lodashGet(state, "workflowList.workflowList.data.results.length", null);
