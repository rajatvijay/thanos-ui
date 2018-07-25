import { workflowDetailsheaderConstants } from "../constants";

export function workflowDetailsHeader(state = {}, action) {
  switch (action.type) {
    //Workflow detials
    case workflowDetailsheaderConstants.GET_REQUEST:
      return {
        loading: true
      };
    case workflowDetailsheaderConstants.GET_SUCCESS:
      return {
        loading: false,
        workflowDetailsHeader: action.workflowDetails
      };
    case workflowDetailsheaderConstants.GET_FAILURE:
      return {
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
