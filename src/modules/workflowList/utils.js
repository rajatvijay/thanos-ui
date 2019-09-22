import {
  MY_TASK_FILTER_NAME,
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME,
  TASK_QUEUE_FILTER_NAME,
  ALERTS_FILTER_NAME,
  KIND_FILTER_NAME,
  PRIMARY_KEY_SORTING_FILTER_NAME,
  PAGE_FILTER_NAME
} from "./constants";
import { get as lodashGet } from "lodash";
import { FormattedMessage } from "react-intl";
import React from "react";

// TODO: Tree shake
import moment from "moment";

export const getWorkflowFitlersParams = filtersFromState => {
  const queryParamsFromState = createParamsFromSelectedFilters(
    filtersFromState
  );

  // This is super a bad hack
  // But a quick win over doing a lot of minor fixes and refactoring
  // Doing this specifically for VET-5267
  // Description: Remove the kind filter in case of my task
  // In case of any questions, please contact rajat@thevetted.com
  if (queryParamsFromState[MY_TASK_FILTER_NAME]) {
    delete queryParamsFromState[KIND_FILTER_NAME];
  }

  // To remove the undefined values
  return JSON.parse(JSON.stringify(queryParamsFromState));
};

const FILTER_SELECTOR = {
  [MY_TASK_FILTER_NAME]: ["value", undefined],
  [STATUS_FILTER_NAME]: ["value", undefined],
  [REGION_FILTER_NAME]: ["value", undefined],
  [BUSINESS_UNIT_FILTER_NAME]: ["value", undefined],
  [TASK_QUEUE_FILTER_NAME]: ["tag", undefined],
  [ALERTS_FILTER_NAME]: ["tag", undefined],
  [KIND_FILTER_NAME]: ["id", undefined],
  [PRIMARY_KEY_SORTING_FILTER_NAME]: ["value", undefined],
  [PAGE_FILTER_NAME]: ["value", undefined]
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

export const getOccurrenceDay = occurrence => {
  const today = moment().startOf("day");
  const thisWeek = moment().startOf("week");
  const thisMonth = moment().startOf("month");

  if (moment(occurrence.created_at).isAfter(today)) {
    return "commonTextInstances.today";
  }
  if (moment(occurrence.created_at).isAfter(thisWeek)) {
    return "commonTextInstances.thisWeek";
  }
  if (moment(occurrence.created_at).isAfter(thisMonth)) {
    return "commonTextInstances.thisMonth";
  }
  return moment(occurrence.created_at).format("MMM");
};
