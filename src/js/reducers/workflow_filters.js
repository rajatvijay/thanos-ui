import { workflowFiltersConstants } from "../constants";
import { notification } from "antd";
import { store } from "../_helpers";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body
  });
};

export function workflowFilters(state = {}, action) {
  console.log(action);

  switch (action.type) {
    case workflowFiltersConstants.SET_REQUEST:
      // let filters= appliedFilter;
      // // if(appliedFilter.[action.workflowFilter[0].filterType]){

      // // }
      // appliedFilter.push(action.workflowFilter)

      return {
        [action.workflowFilter.filterType]: [{ ...action.workflowFilter }]
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
