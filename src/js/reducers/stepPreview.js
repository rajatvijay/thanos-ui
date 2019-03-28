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
    case stepPreviewConstants.PREVIEW_STEP_REQUEST:
      return {
        ...state,
        loading: true
      };
    case stepPreviewConstants.PREVIEW_STEP_SUCCESS:
      return {
        loading: false,
        currentStepFields: action.stepFields,
        error: {}
      };
    case stepPreviewConstants.PREVIEW_STEP_FAILURE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
