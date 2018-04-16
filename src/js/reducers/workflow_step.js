import { workflowStepConstants } from "../constants";

export function currentStepFields(state = {}, action) {
  switch (action.type) {
    //WORKFLOW STEP FEILDS DATA
    case workflowStepConstants.GET_STEPFIELDS_REQUEST:
      return {
        loading: true
      };
    case workflowStepConstants.GET_STEPFIELDS_SUCCESS:
      return {
        loading: false,
        //workflowDetails: { stepGroups: action.stepGroups }
        currentStepFields: action.stepFields
      };
    case workflowStepConstants.GET_STEPFIELDS_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}
