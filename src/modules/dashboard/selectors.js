import { createSelector } from "reselect";
import { get as lodashGet, groupBy } from "lodash";
import { FILTERS_ENUM } from "./constants";
import { getOccurrenceDay } from "./utils";

export const statusesSelector = state => state.workflowList.staticData.statuses;

export const selectedKindSelector = state => {
  return lodashGet(
    state,
    `workflowList.selectedWorkflowFilters[${FILTERS_ENUM.KIND_FILTER.name}].meta`
  );
};

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

export const selectedBasicFiltersSelector = state => {
  return [
    {
      label: "status",
      name: FILTERS_ENUM.STATUS_FILTER.name,
      value: lodashGet(
        state,
        `workflowList.selectedWorkflowFilters[${FILTERS_ENUM.STATUS_FILTER.name}].meta.label`
      )
    },
    {
      label: "region",
      name: FILTERS_ENUM.REGION_FILTER.name,
      value: lodashGet(
        state,
        `workflowList.selectedWorkflowFilters[${FILTERS_ENUM.REGION_FILTER.name}].meta.label`
      )
    },
    {
      label: "businessUnit",
      name: FILTERS_ENUM.BUSINESS_UNIT_FILTER.name,
      value: lodashGet(
        state,
        `workflowList.selectedWorkflowFilters[${FILTERS_ENUM.BUSINESS_UNIT_FILTER.name}].meta.label`
      )
    }
  ];
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

export const hiddenGroupsMainNavSelector = state => {
  return lodashGet(
    state,
    `config.custom_ui_labels["workflows.hiddenGroupsMainNav"]`,
    []
  );
};
export const taskQueuesSelector = state => state.workflowList.taskQueues;
export const visibleTaskQueuesSelector = createSelector(
  taskQueuesSelector,
  hiddenGroupsMainNavSelector,
  (taskQueues, hiddentTags) => {
    if (!taskQueues.data) {
      return taskQueues;
    }
    return {
      ...taskQueues,
      data: taskQueues.data.filter(
        taskQueue => !hiddentTags.includes(taskQueue.tag)
      )
    };
  }
);
export const alertsSelector = state => state.workflowList.alerts;

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
  lodashGet(state, "workflowList.workflowList.data.count", null);

export const isWorkflowSortingEnabledSelector = createSelector(
  selectedKindSelector,
  kind => lodashGet(kind, "is_sorting_field_enabled", false)
);

export const workflowListCountSelector = state =>
  lodashGet(state, "workflowList.workflowList.data.count", 0);
export const workflowListSelector = state =>
  lodashGet(state, "workflowList.workflowList.data.results", []);

export const isSortingFilterAppliedSelector = state => {
  return lodashGet(
    state,
    `workflowList.selectedWorkflowFilters[${FILTERS_ENUM.ORDERING_FILTER.name}].meta`,
    false
  );
};

export const groupedWorkflowsSelector = createSelector(
  workflowListSelector,
  isSortingFilterAppliedSelector,
  (workflows, isSortingFilterApplied) =>
    isSortingFilterApplied
      ? { workflows }
      : groupBy(workflows, getOccurrenceDay)
);
