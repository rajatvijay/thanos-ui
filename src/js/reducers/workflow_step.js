import {
  workflowStepConstants as stepConstants,
  workflowFieldConstants as fieldConstants,
  dunsFieldConstants
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
        [action.step.stepId]: {
          loading: true
        }
      };
    case stepConstants.GET_STEPFIELDS_SUCCESS:
      return {
        ...state,
        [action.stepFields.id]: {
          loading: false,
          currentStepFields: action.stepFields,
          error: {}
        }
      };

    case stepConstants.GET_STEPFIELDS_FAILURE:
      return {
        ...state,
        [action.step.stepId]: {
          loading: false,
          error: action.error
        }
      };

    //////////////////////////////////
    //SUBMIT WORKFLOW STEP FIELDS DATA
    //////////////////////////////////
    case stepConstants.SUBMIT_REQUEST:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          isSubmitting: true,
          loading: true
        }
      };
    case stepConstants.SUBMIT_SUCCESS:
      return {
        ...state,
        [action.stepData.id]: {
          loading: false,
          isSubmitting: false,
          currentStepFields: action.stepData
        }
      };
    case stepConstants.SUBMIT_FAILURE:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          isSubmitting: false,
          error: action.error
        }
      };
    case fieldConstants.POST_FIELD_SUCCESS:
      return {
        ...state,
        [action.field.id]: {
          loading: false,
          isSubmitting: false,
          currentStepFields: action.field,
          error: null
        }
      };
    case fieldConstants.POST_FIELD_FAILURE:
      return {
        ...state,
        [action.workflowId]: {
          ...state[action.workflowId],
          loading: false,
          error: action.error
        }
      };

    // TODO: Fix the actions below this, when cleaning!

    ////////////////////////////////////////////////////////////
    //Update step data on first/initial answer OR POST REQUEST//
    ////////////////////////////////////////////////////////////
    // TODO: Is this even required?
    case fieldConstants.POST_FIELD_REQUEST:
      return {
        ...state,
        loading: false
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
    // TODO: Fix the actions below this, when cleaning!

    /////////////////////////////
    //Update options for field //
    /////////////////////////////
    case fieldConstants.FETCH_FIELD_EXTRA_REQUEST:
      return {
        ...state,
        loading: false
      };
    case fieldConstants.FETCH_FIELD_EXTRA_SUCCESS:
      const extrasFromAPI = state.extrasFromAPI || {};
      extrasFromAPI[action.field.definition.tag] = action.extra;
      return {
        ...state,
        loading: false,
        extrasFromAPI: extrasFromAPI
      };
    case fieldConstants.FETCH_FIELD_EXTRA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    ///////////////////////
    ///Duns field update///
    ///////////////////////
    case dunsFieldConstants.DUNS_SELECT_REQUEST:
    case dunsFieldConstants.DUNS_FIELD_REQUEST:
      return {
        ...state,
        [action.stepId]: {
          ...state[action.stepId],
          integration_data_loading: true
        }
      };
    case dunsFieldConstants.DUNS_SELECT_SUCCESS:
    case dunsFieldConstants.DUNS_FIELD_SUCCESS:
      return {
        ...state,
        [action.field.id]: {
          ...state[action.stepId],
          integration_data_loading: false,
          currentStepFields: action.field,
          error: {}
        }
      };
    case dunsFieldConstants.DUNS_SELECT_FAILURE:
    case dunsFieldConstants.DUNS_FIELD_FAILURE:
      return {
        ...state,
        [action.stepId]: {
          ...state[action.stepId],
          integration_data_loading: false,
          error: action.error
        }
      };
    default:
      return state;
  }
}
