import { workflowFieldConstants, workflowStepConstants } from "../constants";
import { workflowStepService } from "../services";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body
  });
};

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
    openNotificationWithIcon({
      type: "success",
      message: "Saved successfully",
      body: ""
    });

    return {
      type: workflowFieldConstants.POST_FIELD_SUCCESS,
      field
    };
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "something went wrong",
      body: ""
    });
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
    openNotificationWithIcon({
      type: "success",
      message: "Saved successfully",
      body: ""
    });
    return {
      type: workflowFieldConstants.PATCH_FIELD_SUCCESS,
      field
    };
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Something went wrong",
      body: ""
    });
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
    openNotificationWithIcon({
      type: "success",
      message: "Step submitted successfully",
      body: ""
    });

    return {
      type: workflowStepConstants.SUBMIT_SUCCESS,
      stepData
    };
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to submit step.",
      body: "There was an error while submitting the step, please try again."
    });

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
    openNotificationWithIcon({
      type: "success",
      message: "Step approved successfully",
      body: ""
    });

    return {
      type: workflowStepConstants.SUBMIT_SUCCESS,
      stepData
    };
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to approve step.",
      body: "There was an error while approval of the step, please try again."
    });

    return { type: workflowStepConstants.SUBMIT_FAILURE, error };
  }
}
