import { workflowFieldConstants } from "../constants";
import { workflowFieldService } from "../services";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body
  });
};

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
