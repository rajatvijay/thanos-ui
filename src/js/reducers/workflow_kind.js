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
  // console.log('action workflowGroupCountworkflowGroupCount')
  // console.log(action)

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

export function workflowKindStatus(state = {}, action) {
  switch (action.type) {
    case workflowKindConstants.GET_STATUS_REQUEST:
      return {
        loading: true,
        status_counts: []
      };

    case workflowKindConstants.GET_STATUS_SUCCESS:
      return {
        loading: false,
        ...action.workflowStatusCount
      };

    case workflowKindConstants.GET_STATUS_FAILURE:
      return {
        loading: false,
        //status_counts:[],
        loadingStatus: "failed",
        error: action.error
      };

    default:
      return state;
  }
}
