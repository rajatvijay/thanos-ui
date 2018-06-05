import { workflowFieldConstants, workflowStepConstants } from "../constants";
import { workflowStepService } from "../services";
import { notification, message } from "antd";

message.config({
  top: 10,
  duration: 1,
  maxCount: 2
});

export const workflowStepActions = {
  saveField,
  updateField,
  submitStepData,
  approveStep
};

// update data on field change
function saveField(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowStepService
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
    message.success("Saved successfully");

    return {
      type: workflowFieldConstants.POST_FIELD_SUCCESS,
      field
    };
  }
  function failure(error) {
    message.error("Something went wrong");

    return { type: workflowFieldConstants.POST_FIELD_FAILURE, error };
  }
}

// update data on field change
function updateField(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowStepService
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
    message.success("Saved successfully");

    return {
      type: workflowFieldConstants.PATCH_FIELD_SUCCESS,
      field
    };
  }
  function failure(error) {
    message.error("Something went wrong");

    return { type: workflowFieldConstants.PATCH_FIELD_FAILURE, error };
  }
}

//fetch stepgroup  data i.e steps list
function submitStepData(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowStepService
      .submitStep(payload)
      .then(
        stepData => dispatch(success(stepData)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowStepConstants.SUBMIT_REQUEST, payload };
  }
  function success(stepData) {
    message.success("Step submitted successfully");

    return {
      type: workflowStepConstants.SUBMIT_SUCCESS,
      stepData
    };
  }
  function failure(error) {
    message.error("Failed to submit step.");

    return { type: workflowStepConstants.SUBMIT_FAILURE, error };
  }
}

function approveStep(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowStepService
      .approveStep(payload)
      .then(
        stepData => dispatch(success(stepData)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowStepConstants.SUBMIT_REQUEST, payload };
  }
  function success(stepData) {
    message.success("Step approved successfully");

    return {
      type: workflowStepConstants.SUBMIT_SUCCESS,
      stepData
    };
  }
  function failure(error) {
    message.error("Failed to approve step.");

    return { type: workflowStepConstants.SUBMIT_FAILURE, error };
  }
}
