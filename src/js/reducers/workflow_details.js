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
      console.log("action id", action);

      //state = {};
      return {
        ...state,
        [action.id]: { loading: true }
        //loading: true
      };
    case workflowDetailsConstants.GET_STEPGROUPS_SUCCESS:
      return {
        ...state,
        [action.id]: {
          loading: false,
          workflowDetails: { stepGroups: action.stepGroups }
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
