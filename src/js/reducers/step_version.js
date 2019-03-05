import { stepVersionConstants, workflowStepConstants } from "../constants";

const initialState = {
  loading: false,
  stepVersionFields: {}
};

export function stepVersionFields(state = initialState, action) {
  switch (action.type) {
    /////////////////////////////////
    //GET WORKFLOW STEP FIELDS DATA//
    /////////////////////////////////
    case stepVersionConstants.GET_VERSION_REQUEST:
      return {
        loading: true,
        stepVersionFields: {}
      };
    case stepVersionConstants.GET_VERSION_SUCCESS:
      return {
        ...state,
        loading: false,
        stepVersionFields: action.stepVersionFields,
        error: {}
      };
    case stepVersionConstants.GET_VERSION_FAILURE:
      return {
        ...state,
        error: action.error
      };

    case workflowStepConstants.GET_STEPFIELDS_REQUEST:
      return {
        ...state,
        loading: false,
        stepVersionFields: {}
      };
    default:
      return state;
  }
}
