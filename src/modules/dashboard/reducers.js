import { combineReducers } from "redux";
import {
  GET_STATUSES_LIST,
  GET_STATUSES_LIST_SUCCESS,
  GET_STATUSES_LIST_FAILURE,
  GET_REGIONS_LIST,
  GET_REGIONS_LIST_SUCCESS,
  GET_REGIONS_LIST_FAILURE,
  GET_BUSINESS_UNITS_LIST,
  GET_BUSINESS_UNITS_LIST_SUCCESS,
  GET_BUSINESS_UNITS_LIST_FAILURE,
  GET_ALL_KINDS,
  GET_ALL_KINDS_SUCCESS,
  GET_ALL_KINDS_FAILURE,
  GET_ALL_ALERTS,
  GET_ALL_ALERTS_SUCCESS,
  GET_ALL_ALERTS_FAILURE,
  GET_ALL_TASK_QUEUES,
  GET_ALL_TASK_QUEUES_SUCCESS,
  GET_ALL_TASK_QUEUES_FAILURE,
  SET_WORKFLOW_FILTER,
  GET_WORKFLOW_LIST,
  GET_WORKFLOW_LIST_SUCCESS,
  GET_WORKFLOW_LIST_FAILURE,
  GET_ADVANCED_FILTER_DATA,
  GET_ADVANCED_FILTER_DATA_SUCCESS,
  GET_ADVANCED_FILTER_DATA_FAILURE,
  REMOVE_WORKFLOW_FILTERS,
  SET_MULTIPLE_WORKFLOW_FILTERS
} from "./actions";
import { INITIAL_STATE } from "./initialState";

function statuses(
  state = INITIAL_STATE.staticData.statuses,
  { type, payload }
) {
  switch (type) {
    case GET_STATUSES_LIST:
      return {
        ...state,
        isLoading: true
      };
    case GET_STATUSES_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_STATUSES_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

function regions(state = INITIAL_STATE.staticData.regions, { type, payload }) {
  switch (type) {
    case GET_REGIONS_LIST:
      return {
        ...state,
        isLoading: true
      };
    case GET_REGIONS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_REGIONS_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

function businessUnits(
  state = INITIAL_STATE.staticData.businessUnits,
  { type, payload }
) {
  switch (type) {
    case GET_BUSINESS_UNITS_LIST:
      return {
        ...state,
        isLoading: true
      };
    case GET_BUSINESS_UNITS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_BUSINESS_UNITS_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

function advancedFilterData(
  state = INITIAL_STATE.staticData.advancedFilterData,
  { type, payload }
) {
  switch (type) {
    case GET_ADVANCED_FILTER_DATA:
      return {
        ...state,
        isLoading: true
      };
    case GET_ADVANCED_FILTER_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_ADVANCED_FILTER_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

export const staticData = combineReducers({
  statuses,
  regions,
  businessUnits,
  advancedFilterData
});

export function kinds(state = INITIAL_STATE.kinds, { type, payload }) {
  switch (type) {
    case GET_ALL_KINDS:
      return {
        ...state,
        isLoading: true
      };
    case GET_ALL_KINDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_ALL_KINDS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

export function alerts(state = INITIAL_STATE.alerts, { type, payload }) {
  switch (type) {
    case GET_ALL_ALERTS:
      return {
        ...state,
        isLoading: true
      };
    case GET_ALL_ALERTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_ALL_ALERTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

export function taskQueues(
  state = INITIAL_STATE.taskQueues,
  { type, payload }
) {
  switch (type) {
    case GET_ALL_TASK_QUEUES:
      return {
        ...state,
        isLoading: true
      };
    case GET_ALL_TASK_QUEUES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload
      };
    case GET_ALL_TASK_QUEUES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        data: null
      };
    default:
      return state;
  }
}

export function selectedWorkflowFilters(
  state = INITIAL_STATE.selectedWorkflowFilters,
  { type, payload }
) {
  switch (type) {
    case SET_WORKFLOW_FILTER:
      return {
        ...state,
        [payload.name]: payload
      };
    case REMOVE_WORKFLOW_FILTERS:
      const oldFilters = { ...state };
      delete oldFilters[payload];
      return {
        ...oldFilters
      };
    // Having this action directly,
    // instead of using the single one in loop
    // will optimize the rendering part
    // since wonr
    case SET_MULTIPLE_WORKFLOW_FILTERS:
      const newFilters = payload.reduce(
        (filterState, filter) => ({ ...filterState, [filter.name]: filter }),
        {}
      );
      return {
        ...state,
        ...newFilters
      };
    default:
      return state;
  }
}

export function workflowList(
  state = INITIAL_STATE.workflowList,
  { type, payload }
) {
  switch (type) {
    case GET_WORKFLOW_LIST:
      return {
        ...state,
        isLoading: true
      };
    case GET_WORKFLOW_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: payload,
        error: null
      };
    case GET_WORKFLOW_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        data: null,
        error: payload
      };
    default:
      return state;
  }
}