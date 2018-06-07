import {
  workflowStepConstants as stepConstants,
  workflowFieldConstants as fieldConstants
} from "../constants";

const initialState = {
  loading: false,
  currentStepFields: {}
};

export function currentStepFields(state = initialState, action) {
  switch (action.type) {
    /////////////////////////////////
    //GET WORKFLOW STEP FIELDS DATA//
    /////////////////////////////////
    case stepConstants.GET_STEPFIELDS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case stepConstants.GET_STEPFIELDS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: action.stepFields
      };
    case stepConstants.GET_STEPFIELDS_FAILURE:
      return {
        ...state,
        error: action.error
      };

    //////////////////////////////////
    //SUBMIT WORKFLOW STEP FIELDS DATA
    //////////////////////////////////
    case stepConstants.SUBMIT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case stepConstants.SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: action.stepData
      };
    case stepConstants.SUBMIT_FAILURE:
      return {
        ...state,
        error: action.error
      };

    ////////////////////////////////////////////////////////////
    //Update step data on first/initial answer OR POST REQUEST//
    ////////////////////////////////////////////////////////////
    case fieldConstants.POST_FIELD_REQUEST:
      return {
        ...state,
        loading: false
      };
    case fieldConstants.POST_FIELD_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: { ...action.field }
      };
    case fieldConstants.POST_FIELD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    //////////////////////////////////////////////////////
    //Update step data on answer change OR PATCH REQUEST//
    //////////////////////////////////////////////////////
    case fieldConstants.PATCH_FIELD_REQUEST:
      return {
        ...state,
        loading: false
      };
    case fieldConstants.PATCH_FIELD_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: { ...action.field }
      };
    case fieldConstants.PATCH_FIELD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}
