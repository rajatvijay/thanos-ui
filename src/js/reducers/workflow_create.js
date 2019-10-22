import { workflowCreateConstants } from "../constants";

export function workflowCreate(state = {}, action) {
  switch (action.type) {
    case workflowCreateConstants.CREATE_REQUEST:
      return {
        loading: true
      };
    case workflowCreateConstants.CREATE_SUCCESS:
      return {
        loading: false,
        workflowCreate: action.workflowCreate
      };
    case workflowCreateConstants.CREATE_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}
