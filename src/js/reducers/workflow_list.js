import { workflowConstants } from "../constants";

export function workflow(state = {}, action) {
  switch (action.type) {
    case workflowConstants.GETALL_REQUEST:
      return {
        loading: true
        //workflowList: action.workflows,
      };
    case workflowConstants.GETALL_SUCCESS:
      return {
        loading: false,
        workflow: action.workflow
      };
    case workflowConstants.GETALL_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    case workflowConstants.CREATE_REQUEST:
      return {
        loading: true
        //workflowList: action.workflows,
      };
    case workflowConstants.CREATE_SUCCESS:
      return {
        loading: false,
        workflow: action.workflow
      };
    case workflowConstants.CREATE_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}
