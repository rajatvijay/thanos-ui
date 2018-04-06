import { workflowConstants } from "../constants";

//const initialState = user ? { loggedIn: true, user } : {};

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
    default:
      return state;
  }
}
