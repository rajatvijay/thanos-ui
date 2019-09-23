import { createSelector } from "reselect";
import { get as lodashGet, groupBy } from "lodash";
import {
  TASK_QUEUE_FILTER_NAME,
  ALERTS_FILTER_NAME,
  MY_TASK_FILTER_NAME,
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME,
  PRIMARY_KEY_SORTING_FILTER_NAME
} from "./constants";
import { getOccurrenceDay } from "./utils";

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
            .map(status => ({
              label: status.label,
              value: status.id
            }))
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

export const selectedBasicFiltersSelector = state => {
  return JSON.parse(
    JSON.stringify({
      status: lodashGet(
        state,
        `workflowList.selectedWorkflowFilters[${STATUS_FILTER_NAME}].label`
      ),
      region: lodashGet(
        state,
        `workflowList.selectedWorkflowFilters[${REGION_FILTER_NAME}].label`
      ),
      businessUnit: lodashGet(
        state,
        `workflowList.selectedWorkflowFilters[${BUSINESS_UNIT_FILTER_NAME}].label`
      )
    })
  );
};

export const kindsSelector = state => state.workflowList.kinds;
export const kindsForNewWorkflowSelector = createSelector(
  kindsSelector,
  kinds =>
    kinds.data && Array.isArray(kinds.data.results)
      ? kinds.data.results.filter(
          kind =>
            !kind.is_related_kind &&
            kind.features.includes("add_workflow") &&
            !["users", "entity-id"].includes(kind.tag)
        )
      : null
);

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

export const selectedSortingOrderSelector = state =>
  lodashGet(
    state,
    `workflowList.selectedWorkflowFilters[${PRIMARY_KEY_SORTING_FILTER_NAME}].value`,
    null
  );

export const isWorkflowSortingEnabledSelector = createSelector(
  selectedKindSelector,
  kind => lodashGet(kind, "is_sorting_field_enabled", false)
);

export const workflowListCountSelector = state =>
  lodashGet(state, "workflowList.workflowList.data.count", 0);
export const workflowListSelector = state =>
  lodashGet(state, "workflowList.workflowList.data.results", []);

export const groupedWorkflowsSelector = createSelector(
  workflowListSelector,
  workflows => groupBy(workflows, getOccurrenceDay)
);
