import { workflowDetailsConstants } from "../constants";

const initialState = {
  loading: false,
  workflowDetails: {},
  error: null
};

export function workflowDetails(state = {}, action) {
  switch (action.type) {
    //Workflow detials
    case workflowDetailsConstants.GET_REQUEST:
      return {
        loading: true
      };
    case workflowDetailsConstants.GET_SUCCESS:
      return {
        workflowDetails: action.workflowDetails
      };
    case workflowDetailsConstants.GET_FAILURE:
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
