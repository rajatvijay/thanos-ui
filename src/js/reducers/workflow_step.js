import { workflowStepConstants, workflowFieldConstants } from "../constants";

const initialState = {
  loading: false,
  currentStepFields: {}
};

export function currentStepFields(state = initialState, action) {
  // console.log("current step data with action");
  // console.log(action);

  switch (action.type) {
    //WORKFLOW STEP FIELDS DATA
    case workflowStepConstants.GET_STEPFIELDS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case workflowStepConstants.GET_STEPFIELDS_SUCCESS:
      return {
        ...state,
        loading: false,
        //workflowDetails: { stepGroups: action.stepGroups }
        currentStepFields: action.stepFields
      };
    case workflowStepConstants.GET_STEPFIELDS_FAILURE:
      return {
        ...state,
        error: action.error
      };

    //Update step data on first/initial answer OR POST REQUEST
    case workflowFieldConstants.POST_FIELD_REQUEST:
      return {
        ...state,
        loading: false
      };
    case workflowFieldConstants.POST_FIELD_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: { ...action.field }
      };
    case workflowFieldConstants.POST_FIELD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    //Update step data on answer change OR PATCH REQUEST
    case workflowFieldConstants.PATCH_FIELD_REQUEST:
      return {
        ...state,
        loading: false
      };
    case workflowFieldConstants.PATCH_FIELD_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStepFields: { ...action.field }
      };
    case workflowFieldConstants.PATCH_FIELD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}

// export function currentStepData(state = {}, action) {

//   switch (action.type) {
//     //WORKFLOW STEP FIELDS DATA
//     case workflowStepConstants.SUMBIT_REQUEST:
//       return {
//         loading: true
//       };
//     case workflowStepConstants.SUBMIT_SUCCESS:
//       return {
//         loading: false,
//         //workflowDetails: { stepGroups: action.stepGroups }
//         currentStep: action.stepData
//       };
//     case workflowStepConstants.SUBMIT_FAILURE:
//       return {
//         error: action.error
//       };

//     default:
//       return state;
//   }
// }
