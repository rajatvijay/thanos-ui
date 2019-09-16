import { workflowFiltersConstants } from "../constants";
import _ from "lodash";

const initialState = {
  kind: {
    filterType: "kind",
    filterValue: [],
    meta: {}
  },
  status: [],
  region: [],
  business_unit: [],
  multifilter: null,
  stepgroupdef: null,
  advFilter: null
};

const initialDataState = {
  loading: true,
  statusType: {},
  businessType: { loading: true },
  regionType: { loading: true }
};

// FUCNTION FOR FILTERING THE WORKFLOW WITH THE FILTER OPTION ON THE LEFT SIDEBAR.
export function workflowFilters(state = initialState, action) {
  switch (action.type) {
    case workflowFiltersConstants.SET_REQUEST:
      return {
        ...state,
        [action.workflowFilter.filterType]: { ...action.workflowFilter }
      };

    case workflowFiltersConstants.GET_REQUEST:
      return {
        workflowFilters: [{ ...action.workflowFilter }]
      };

    case workflowFiltersConstants.DELETE_REQUEST:
      const newState = { ...state };
      delete newState[action.workflowFilter.filterType];
      return {
        ...newState
      };

    case workflowFiltersConstants.CLEAR_FILTERS:
      return {
        ...state,
        status: [],
        region: [],
        business_unit: [],
        advFilter: null,
        advance: []
      };

    default:
      return state;
  }
}

function normalizeData(data) {
  const arr = [];

  _.map(data, function(item) {
    const i = item;
    i.value = item.id;
    arr.push(i);
  });
  return arr;
}

function sortData(data) {
  return data.sort((a, b) =>
    a.label > b.label ? 1 : a.label < b.label ? -1 : 0
  );
}

//ADD THE TYPES OF FILTER AVAILABLE TO REDUX STORE
export function workflowFilterType(state = initialDataState, action) {
  switch (action.type) {
    case workflowFiltersConstants.GET_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        statusType: []
      };

    case workflowFiltersConstants.GET_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        statusType: normalizeData(action.workflowFilterStatus)
      };

    case workflowFiltersConstants.GET_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        statusType: { error: action.error }
      };

    //kind type fitler data

    case workflowFiltersConstants.GET_BUSINESS_UNIT_REQUEST:
      return {
        ...state,
        loading: true,
        businessType: { loading: true }
      };

    case workflowFiltersConstants.GET_BUSINESS_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        businessType: {
          loading: false,
          results: sortData(action.workflowFilterBusiness.results)
        }
      };

    case workflowFiltersConstants.GET_BUSINESS_UNIT_FAILURE:
      return {
        ...state,
        loading: false,
        businessType: { loading: false, error: action.error }
      };

    case workflowFiltersConstants.GET_REGION_REQUEST:
      return {
        ...state,
        loading: true,
        regionType: { loading: true }
      };

    case workflowFiltersConstants.GET_REGION_SUCCESS:
      return {
        ...state,
        loading: false,
        regionType: {
          loading: false,
          results: sortData(action.workflowFilterRegion.results)
        }
      };

    case workflowFiltersConstants.GET_REGION_FAILURE:
      return {
        ...state,
        loading: false,
        regionType: { loading: false, error: action.error }
      };

    default:
      return state;
  }
}
