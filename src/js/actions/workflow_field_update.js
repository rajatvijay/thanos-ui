import { workflowFieldConstants } from "../constants";
import { workflowFieldService } from "../services";

export const workflowFieldActions = {
  saveField,
  updateField
};

// update data on field change
function saveField(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowFieldService
      .saveField(payload)
      .then(
        field => dispatch(success(field)),
        error => dispatch(failure(error))
      );
  };

  function request(payload) {
    return { type: workflowFieldConstants.POST_FIELD_REQUEST, payload };
  }
  function success(field) {
    return {
      type: workflowFieldConstants.POST_FIELD_SUCCESS,
      field
    };
  }
  function failure(error) {
    return { type: workflowFieldConstants.POST_FIELD_FAILURE, error };
  }
}

// update data on field change
function updateField(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowFieldService
      .updateField(payload)
      .then(
        field => dispatch(success(field)),
        error => dispatch(failure(error))
      );
  };

  function request(payload) {
    return { type: workflowFieldConstants.PATCH_FIELD_REQUEST, payload };
  }
  function success(field) {
    return {
      type: workflowFieldConstants.PATCH_FIELD_SUCCESS,
      field
    };
  }
  function failure(error) {
    return { type: workflowFieldConstants.PATCH_FIELD_FAILURE, error };
  }
}
