import { workflowDetailsheaderConstants } from "../constants";

export function workflowDetailsHeader(state = {}, action) {
  switch (action.type) {
    //Workflow detials
    case workflowDetailsheaderConstants.GET_REQUEST:
      return { ...state, loading: true };
    case workflowDetailsheaderConstants.GET_SUCCESS:
      return {
        ...state,
        loading: false,
        [action.workflowDetails.id]: action.workflowDetails,
        workflowDetailsHeader: action.workflowDetails
      };
    case workflowDetailsheaderConstants.GET_FAILURE:
      return {
        loading: false,
        error: action.error || "Error"
      };
    case workflowDetailsheaderConstants.ARCHIVE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case workflowDetailsheaderConstants.ARCHIVE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case workflowDetailsheaderConstants.ARCHIVE_REQUEST_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
}
