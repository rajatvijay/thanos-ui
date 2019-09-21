import {
  MY_TASK_FILTER_NAME,
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME,
  TASK_QUEUE_FILTER_NAME,
  ALERTS_FILTER_NAME,
  KIND_FILTER_NAME
} from "./constants";
import { get as lodashGet } from "lodash";

export const getWorkflowFitlersParams = filtersFromState => {
  const queryParamsFromState = createParamsFromSelectedFilters(
    filtersFromState
  );

  if (queryParamsFromState[MY_TASK_FILTER_NAME]) {
    delete queryParamsFromState[KIND_FILTER_NAME];
  }

  return queryParamsFromState;
};

const FILTER_SELECTOR = {
  [MY_TASK_FILTER_NAME]: [null, "Assignee"],
  [STATUS_FILTER_NAME]: ["value", null],
  [REGION_FILTER_NAME]: ["value", null],
  [BUSINESS_UNIT_FILTER_NAME]: ["value", null],
  [TASK_QUEUE_FILTER_NAME]: ["tag", null],
  [ALERTS_FILTER_NAME]: ["tag", null],
  [KIND_FILTER_NAME]: ["id", null]
};

const createParamsFromSelectedFilters = filters => {
  const params = {};

  for (let filterName in filters) {
    const selector = FILTER_SELECTOR[filterName];
    const filterValue = filters[filterName];
    params[filterName] = lodashGet(filterValue, selector[0], selector[1]);
  }

  return params;
};
