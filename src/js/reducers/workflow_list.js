import { workflowConstants } from "../constants";

export function workflow (state = {}, action) {
  switch (action.type) {
    case workflowConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case workflowConstants.GETALL_SUCCESS:
      return {
        items: action.workflows
      };
    case workflowConstants.GETALL_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
}
