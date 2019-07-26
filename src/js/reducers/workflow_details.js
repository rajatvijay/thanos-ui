import { workflowDetailsConstants } from "../constants";

export function workflowDetails(state = {}, action) {
  switch (action.type) {
    //Workflow detials
    case workflowDetailsConstants.GET_REQUEST:
      return {
        ...state,
        loading: true
      };
    case workflowDetailsConstants.GET_SUCCESS:
      return {
        ...state,
        workflowDetails: action.workflowDetails
      };
    case workflowDetailsConstants.GET_FAILURE:
      return {
        ...state,
        error: action.error
      };

    //WORKFLOW STEPS AND GROUPS LIST DATA
    case workflowDetailsConstants.GET_STEPGROUPS_REQUEST:
      return {
        ...state,
        [action.id]: { loading: true }
      };
    case workflowDetailsConstants.GET_STEPGROUPS_SUCCESS:
      return {
        ...state,
        [action.id]: {
          loading: false,
          workflowDetails: { stepGroups: action.stepGroups },
          isActive: action["isActive"]
        },
        loading: false,
        workflowDetails: { stepGroups: action.stepGroups }
      };
    case workflowDetailsConstants.GET_STEPGROUPS_FAILURE:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
}

export function hasStepinfo(state = { stepInfo: false }, action) {
  switch (action.type) {
    //
    case workflowDetailsConstants.SET_STEP_ID:
      return {
        ...state,
        stepInfo: action.payload
      };

    case workflowDetailsConstants.REMOVE_STEP_ID:
      return {
        stepInfo: false
      };

    default:
      return state;
  }
}
