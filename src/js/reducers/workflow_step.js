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
        loading: true
      };
    case stepConstants.GET_STEPFIELDS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: action.stepFields,
        error: {}
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
        isSubmitting: true,
        loading: true
      };
    case stepConstants.SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        isSubmitting: false,
        currentStepFields: action.stepData
      };
    case stepConstants.SUBMIT_FAILURE:
      return {
        ...state,
        isSubmitting: false,
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
      console.log(action.field);
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

    /////////////////////////////
    //Update options for field //
    /////////////////////////////
    case fieldConstants.FETCH_FIELD_EXTRA_REQUEST:
      return {
        ...state,
        loading: false
      };
    case fieldConstants.FETCH_FIELD_EXTRA_SUCCESS:
      let extrasFromAPI = state.extrasFromAPI || {};
      extrasFromAPI[action.field.definition.tag] = action.extra;
      console.log({ extrasFromAPI });
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
    case dunsFieldConstants.DUNS_FIELD_REQUEST:
      return {
        ...state,
        integration_data_loading: true
      };
    case dunsFieldConstants.DUNS_FIELD_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_data_loading: false,
        currentStepFields: action.field,
        error: {}
      };
    case dunsFieldConstants.DUNS_FIELD_FAILURE:
      return {
        ...state,
        error: action.error
      };

    /////////////////////
    ///Duns select item//
    /////////////////////
    case dunsFieldConstants.DUNS_SELECT_REQUEST:
      return {
        ...state,
        integration_data_loading: true
      };
    case dunsFieldConstants.DUNS_SELECT_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_data_loading: false,
        currentStepFields: action.field,
        error: {}
      };
    case dunsFieldConstants.DUNS_SELECT_FAILURE:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
}
