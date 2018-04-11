import { workflowKindConstants } from "../constants";

export function workflowKind(state = {}, action) {
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
