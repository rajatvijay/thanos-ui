import { changeStatusConstants } from "../constants";

export function changeStatus(state = {}, action) {
  switch (action.type) {
    case changeStatusConstants.CHANGE_REQUEST:
      return {
        loading: true
      };
    case changeStatusConstants.CHANGE_SUCCESS:
      return {
        loading: false
        //workflowCreate: action.workflowCreate
      };
    case changeStatusConstants.CHANGE_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}
