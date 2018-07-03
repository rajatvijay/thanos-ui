import { workflowFiltersConstants } from "../constants";

const initialState = {
  kind: {
    filterType: "kind",
    filterValue: [2],
    meta: { tag: "enroll-supplier" }
  },
  status: null,
  region: null,
  business: null,
  multifilter: null,
  stepgroupdef: null,
  advFilter: null
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
        //loading: true
        workflowFilters: [{ ...action.workflowFilter }]
      };

    case workflowFiltersConstants.REMOVE_REQUEST:
      return {
        //loading: true
        workflowFilters: [{ ...action.workflowFilter }]
      };

    default:
      return state;
  }
}

//ADD THE TYPES OF FILTER AVAILABLE TO REDUX STORE
export function workflowFilterType(state = {}, action) {
  switch (action.type) {
    case workflowFiltersConstants.GET_STATUS_REQUEST:
      return {
        loading: true
      };

    case workflowFiltersConstants.GET_STATUS_SUCCESS:
      return {
        loading: false,
        statusType: { ...action.workflowFilterStatus }
      };

    case workflowFiltersConstants.GET_STATUS_FAILURE:
      return {
        loading: false,
        error: action.error
      };

    case workflowFiltersConstants.GET_KIND_REQUEST:
      return {
        loading: true
      };

    case workflowFiltersConstants.GET_KIND_SUCCESS:
      return {
        loading: false,
        workflowFilters: { ...action.workflowFilters }
      };

    case workflowFiltersConstants.GET_KIND_FAILURE:
      return {
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}
