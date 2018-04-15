import { workflowDetailsConstants, workflowStepConstants } from "../constants";

export function workflowDetails(state = {}, action) {
  switch (action.type) {
    //Workflow detials
    case workflowDetailsConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case workflowDetailsConstants.GETALL_SUCCESS:
      return {
        workflowDetails: action.workflowDetails
      };
    case workflowDetailsConstants.GETALL_FAILURE:
      return {
        error: action.error
      };

    //WORKFLOW STEPS AND GROUPS LIST DATA
    case workflowDetailsConstants.GET_STEPGROUPS_REQUEST:
      return {
        loading: true
      };
    case workflowDetailsConstants.GET_STEPGROUPS_SUCCESS:
      return {
        loading: false,
        workflowDetails: { stepGroups: action.stepGroups }
      };
    case workflowDetailsConstants.GET_STEPGROUPS_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}
