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
  business: [],
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

function normalizeData(data) {
  let arr = [];

  _.map(data, function(item) {
    console.log(item);
    let i = item;
    i.value = item.id;
    arr.push(i);
  });

  console.log("arr------");
  console.log(arr);
  return arr;
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
    // case workflowFiltersConstants.GET_KIND_REQUEST:
    //   return {
    //     loading: true
    //   };

    // case workflowFiltersConstants.GET_KIND_SUCCESS:
    //   return {
    //     loading: false,
    //     workflowFilters: { ...action.workflowFilters }
    //   };

    // case workflowFiltersConstants.GET_KIND_FAILURE:
    //   return {
    //     loading: false,
    //     error: action.error
    //   };

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
        businessType: { loading: false, ...action.workflowFilterBusiness }
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
        regionType: { loading: false, ...action.workflowFilterRegion }
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
