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
  GET_ALL_TASK_QUEUES_FAILURE
} from "./actions";

const INITIAL_STATE = {
  staticData: {
    statuses: {
      isLoading: false,
      data: null,
      error: null
    },
    regions: {
      isLoading: false,
      data: null,
      error: null
    },
    businessUnits: {
      isLoading: false,
      data: null,
      error: null
    }
  },
  kinds: {
    isLoading: false,
    data: null,
    error: null
  },
  alerts: {
    isLoading: false,
    data: null,
    error: null
  },
  taskQueues: {
    isLoading: false,
    data: null,
    error: null
  }
};

function statuses(
  state = INITIAL_STATE.staticData.statuses,
  { type, payload }
) {
  switch (type) {
    case GET_STATUSES_LIST:
      return {
        ...state,
        statuses: {
          isLoading: true
        }
      };
    case GET_STATUSES_LIST_SUCCESS:
      return {
        ...state,
        statuses: {
          isLoading: false,
          error: null,
          data: payload
        }
      };
    case GET_STATUSES_LIST_FAILURE:
      return {
        ...state,
        statuses: {
          isLoading: false,
          error: payload,
          data: null
        }
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
        statuses: {
          isLoading: true
        }
      };
    case GET_REGIONS_LIST_SUCCESS:
      return {
        ...state,
        statuses: {
          isLoading: false,
          error: null,
          data: payload
        }
      };
    case GET_REGIONS_LIST_FAILURE:
      return {
        ...state,
        statuses: {
          isLoading: false,
          error: payload,
          data: null
        }
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
        statuses: {
          isLoading: true
        }
      };
    case GET_BUSINESS_UNITS_LIST_SUCCESS:
      return {
        ...state,
        statuses: {
          isLoading: false,
          error: null,
          data: payload
        }
      };
    case GET_BUSINESS_UNITS_LIST_FAILURE:
      return {
        ...state,
        statuses: {
          isLoading: false,
          error: payload,
          data: null
        }
      };
    default:
      return state;
  }
}

export const staticData = combineReducers({ statuses, regions, businessUnits });

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
