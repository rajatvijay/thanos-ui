import { workflowFieldConstants, workflowStepConstants } from "../constants";
import { workflowStepService } from "../services";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export const workflowStepActions = {
  saveField,
  updateField,
  submitStepData,
  approveStep,
  undoStep
};

////////////////////////////////
// update data on field change//
////////////////////////////////
function saveField(payload) {
  return dispatch => {
    dispatch(request(payload));
    dispatch(remove_errors({}));
    
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

  function remove_errors(payload) {
    return { type: workflowFieldConstants.POST_FIELD_FAILURE, payload };
  }

  function success(field) {
    // hack for to avoid response.json promise in case of failure
    if(!field.id) {
      return failure(field)
    }

    openNotificationWithIcon({
      type: "success",
      message: "Saved successfully"
    });

    return { type: workflowFieldConstants.POST_FIELD_SUCCESS, field };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to save."
    });
    return { type: workflowFieldConstants.POST_FIELD_FAILURE, error };
  }
}

////////////////////////////////
// update data on field change//
////////////////////////////////
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
      message: "Saved successfully"
    });

    return { type: workflowFieldConstants.PATCH_FIELD_SUCCESS, field };
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to update."
    });

    return { type: workflowFieldConstants.PATCH_FIELD_FAILURE, error };
  }
}

////////////////////////////////////////
//fetch stepgroup  data i.e steps list//
////////////////////////////////////////
function submitStepData(payload) {
  return dispatch => {
    dispatch(request(payload));
    dispatch(remove_errors({}));
     
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

  function remove_errors(payload) {
    return { type: workflowFieldConstants.POST_FIELD_FAILURE, payload };
  }

  function success(stepData) {
    // hack for to avoid response.json promise in case of failure
    if(!stepData.id) {
      return failure(stepData)
    }
    openNotificationWithIcon({
      type: "success",
      message: "Submitted successfully"
    });

    return { type: workflowStepConstants.SUBMIT_SUCCESS, stepData };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to submit step."
    });

    return { type: workflowStepConstants.SUBMIT_FAILURE, error };
  }
}

////////////////
//Approve step//
////////////////
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
    return { type: workflowStepConstants.SUBMIT_REQUEST, payload }; //{ type: workflowStepConstants.APPROVE_REQUEST, payload };
  }
  function success(stepData) {
    openNotificationWithIcon({
      type: "success",
      message: "Approved"
    });

    return { type: workflowStepConstants.SUBMIT_SUCCESS, stepData }; //{type: workflowStepConstants.APPROVE_SUCCESS,stepData};
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to approve step"
    });

    return { type: workflowStepConstants.SUBMIT_FAILURE, error }; //{ type: workflowStepConstants.APPROVE_FAILURE, error };
  }
}

/////////////
//Undo step//
/////////////
function undoStep(payload) {
  return dispatch => {
    dispatch(request(payload));

    workflowStepService
      .undoStep(payload)
      .then(
        stepData => dispatch(success(stepData)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowStepConstants.SUBMIT_REQUEST, payload }; //{ type: workflowStepConstants.UNDO_REQUEST, payload };
  }
  function success(stepData) {
    openNotificationWithIcon({
      type: "success",
      message: "Successfully reverted step completion"
    });

    return { type: workflowStepConstants.SUBMIT_SUCCESS, stepData }; //{type: workflowStepConstants.UNDO_SUCCESS,stepData};
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to revert completion"
    });

    return { type: workflowStepConstants.SUBMIT_FAILURE, error }; //{ type: workflowStepConstants.UNDO_FAILURE, error };
  }
}
