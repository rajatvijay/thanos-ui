import { FILTERS_ENUM } from "./constants";

export const INITIAL_STATE = {
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
    },
    advancedFilterData: {
      isLoading: false,
      data: null,
      error: null
    }
  },
  selectedWorkflowFilters: {
    [FILTERS_ENUM.PAGE_FILTER.name]: {
      name: FILTERS_ENUM.PAGE_FILTER.name,
      key: FILTERS_ENUM.PAGE_FILTER.key,
      value: 1,
      meta: 1
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
  },
  workflowList: {
    isLoading: false,
    data: null,
    error: null
  }
};
