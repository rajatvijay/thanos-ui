import { workflowKindConstants } from "../constants";

export function workflowKind(
  state = { loading: false, workflowKind: null },
  action
) {
  switch (action.type) {
    case workflowKindConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case workflowKindConstants.GETALL_SUCCESS:
      return {
        loading: false,
        workflowKind: action.workflowKind
      };
    case workflowKindConstants.GETALL_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}

export function workflowGroupCount(state = {}, action) {
  switch (action.type) {
    case workflowKindConstants.GET_COUNT_REQUEST:
      return {
        loading: true
      };

    case workflowKindConstants.GET_COUNT_SUCCESS:
      return {
        loading: false,
        ...action.workflowGroupCount
      };

    case workflowKindConstants.GET_COUNT_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };

    default:
      return state;
  }
}

export function workflowAlertGroupCount(state = {}, action) {
  switch (action.type) {
    case workflowKindConstants.GET_ALERT_COUNT_REQUEST:
      return {
        loading: true
      };

    case workflowKindConstants.GET_ALERT_COUNT_SUCCESS:
      return {
        loading: false,
        ...action.workflowAlertGroupCount,
        isError: false
      };

    case workflowKindConstants.GET_ALERT_COUNT_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error,
        isError: true
      };

    default:
      return state;
  }
}

export function workflowKindValue(state = { selectedKindValue: null }, action) {
  switch (action.type) {
    case workflowKindConstants.SET_VALUE:
      return {
        ...state,
        selectedKindValue: action.payload
      };

    default:
      return state;
  }
}
