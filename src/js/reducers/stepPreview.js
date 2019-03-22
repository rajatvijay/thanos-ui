import { stepPreviewConstants } from "../constants";

const initialState = {
  loading: false,
  currentStepFields: {}
};

export function stepPreviewFields(state = initialState, action) {
  switch (action.type) {
    /////////////////////////////////
    //GET WORKFLOW STEP FIELDS DATA//
    /////////////////////////////////
    case stepPreviewConstants.GET_STEPFIELDS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case stepPreviewConstants.GET_STEPFIELDS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: action.stepFields,
        error: {}
      };
    case stepPreviewConstants.GET_STEPFIELDS_FAILURE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
