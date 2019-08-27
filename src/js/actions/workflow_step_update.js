import {
  fieldConstants,
  workflowStepConstants,
  workflowCommentsConstants
} from "../constants";
import { workflowStepService } from "../services";
import { notification, message } from "antd";
import _ from "lodash";
import {
  workflowDetailsActions,
  workflowFiltersActions,
  stepPreviewActions
} from "../actions";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft",
    duration: data.duration || 4.5
  });
};

export const workflowStepActions = {
  saveField,
  submitStepData,
  approveStep,
  undoStep,
  addComment,
  updateFlag,
  updateIntegrationStatus,
  fetchFieldExtra,
  removeAttachment
};

////////////////////////////////
// update data on field change//
////////////////////////////////
function saveField(payload, event_type) {
  let workflowId;
  return (dispatch, getState) => {
    const reduxState = getState();
    workflowId = Object.keys(reduxState.currentStepFields).find(
      stepId =>
        reduxState.currentStepFields[stepId].currentStepFields &&
        reduxState.currentStepFields[stepId].currentStepFields.workflow ===
          payload.workflow
    );
    dispatch(request(payload));
    dispatch(remove_errors({}, workflowId));

    workflowStepService
      .saveField(payload)
      .then(
        step => dispatch(success(step, event_type)),
        error => dispatch(failure(error, workflowId))
      );
  };

  function request(payload) {
    message.loading("", 10);
    return { type: fieldConstants.RESPONSE_SAVE_REQUEST, payload };
  }

  function remove_errors(payload, workflowId) {
    return {
      type: fieldConstants.RESPONSE_SAVE_FAILURE,
      payload,
      workflowId
    };
  }

  function success(step) {
    message.destroy();
    // hack for to avoid response.json promise in case of failure
    if (!step.id) {
      // TODO: Blechh! Step is not step, but the error we got
      return failure(step, workflowId);
    }

    return { type: fieldConstants.RESPONSE_SAVE_SUCCESS, step };
  }

  function failure(error, workflowId) {
    message.destroy();
    return {
      type: fieldConstants.RESPONSE_SAVE_FAILURE,
      error,
      workflowId
    };
  }
}

/////////////////////////////
// fetch extra for field   //
/////////////////////////////
function fetchFieldExtra(field, answerFunction) {
  return dispatch => {
    dispatch(request(field));

    workflowStepService
      .fetchFieldExtra(field, answerFunction)
      .then(
        body => dispatch(success(field, body.results)),
        error => dispatch(failure(error))
      );
  };

  function request(field) {
    return { type: fieldConstants.FIELD_FETCH_EXTRA_REQUEST, field };
  }

  function success(field, extra) {
    return {
      type: fieldConstants.FIELD_FETCH_EXTRA_SUCCESS,
      field,
      extra
    };
  }

  function failure(error) {
    return { type: fieldConstants.FIELD_FETCH_EXTRA_FAILURE, error };
  }
}

function removeAttachment(payload, event_type) {
  const workflowId = payload.id;
  return dispatch => {
    dispatch(request(payload));
    dispatch(remove_errors({}, workflowId));

    workflowStepService
      .removeAttachment(payload)
      .then(
        step => dispatch(success(step, event_type)),
        error => dispatch(failure(error, workflowId))
      );
  };

  function request(payload) {
    return { type: fieldConstants.RESPONSE_SAVE_REQUEST, payload };
  }

  function remove_errors(payload, workflowId) {
    return {
      type: fieldConstants.RESPONSE_SAVE_FAILURE,
      payload,
      workflowId
    };
  }

  function success(step) {
    // hack for to avoid response.json promise in case of failure
    if (!step.id) {
      return failure(step);
    }

    return { type: fieldConstants.RESPONSE_SAVE_SUCCESS, step };
  }

  function failure(error, workflowId) {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to save."
    });
    return {
      type: fieldConstants.RESPONSE_SAVE_FAILURE,
      error,
      workflowId
    };
  }
}

////////////////////////////////////////
//fetch stepgroup  data i.e steps list//
////////////////////////////////////////
function submitStepData(payload) {
  const { id } = payload;
  return dispatch => {
    dispatch(request(payload));
    dispatch(remove_errors({}, id));

    workflowStepService.submitStep(payload).then(
      stepData => {
        dispatch(success(stepData));
        if (stepData.id) {
          dispatch(
            workflowDetailsActions.getStepGroup(stepData.workflow, true)
          );
          dispatch(workflowFiltersActions.getStatusData());
          dispatch(workflowDetailsActions.getById(stepData.workflow));
        }
      },

      error => {
        dispatch(failure(error, { id }));
      }
    );
  };

  function request() {
    return { type: workflowStepConstants.SUBMIT_REQUEST, payload };
  }

  function remove_errors(payload, workflowId) {
    return {
      type: fieldConstants.RESPONSE_SAVE_FAILURE,
      payload,
      workflowId
    };
  }

  function success(stepData) {
    // hack for to avoid response.json promise in case of failure
    if (!stepData.id) {
      return failure("error", stepData);
    }
    openNotificationWithIcon({
      type: "success",
      message: "Submitted successfully"
    });

    return { type: workflowStepConstants.SUBMIT_SUCCESS, stepData };
  }

  function failure(error, payload) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to submit step."
    });

    return {
      type: workflowStepConstants.SUBMIT_FAILURE,
      error,
      payload: { ...payload, id }
    };
  }
}

////////////////
//Approve step//
////////////////
function approveStep(payload) {
  const workflowId = payload.id;
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
      message: "Approved"
    });

    return { type: workflowStepConstants.SUBMIT_SUCCESS, stepData };
  }
  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to approve step"
    });

    return {
      type: workflowStepConstants.SUBMIT_FAILURE,
      error,
      payload: { id: workflowId }
    };
  }
}

/////////////
//Undo step//
/////////////
function undoStep(payload) {
  const workflowId = payload.id;
  return dispatch => {
    dispatch(request(payload));

    workflowStepService.undoStep(payload).then(
      stepData => {
        dispatch(success(stepData));
        if (stepData.id) {
          dispatch(workflowDetailsActions.getStepGroup(stepData.workflow));
          // call an action to update the sidebar here
        }
      },
      error => dispatch(failure(error, payload))
    );
  };

  function request() {
    return { type: workflowStepConstants.SUBMIT_REQUEST, payload };
  }
  function success(stepData) {
    openNotificationWithIcon({
      type: "success",
      message: "Successfully reverted step completion"
    });
    return { type: workflowStepConstants.SUBMIT_SUCCESS, stepData };
  }
  function failure(error, payload) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to revert completion"
    });

    return {
      type: workflowStepConstants.SUBMIT_FAILURE,
      error,
      payload: { ...payload, id: workflowId }
    };
  }
}

////////////////////
//Adding a Commnt //
////////////////////
function addComment(payload, step_reload_payload, isEmbedded) {
  return dispatch => {
    workflowStepService.addComment(payload).then(
      commentData => {
        if (commentData["detail"]) {
          dispatch(failure(commentData));
          return;
        }
        commentData.isEmbedded = isEmbedded;
        dispatch(success(commentData));
        if (
          _.size(commentData.results) &&
          !commentData.results[0].target.workflow_details
        ) {
          const stepTrack = {
            workflowId: commentData.results[0].target.workflow,
            groupId: commentData.results[0].target.step_group_details.id,
            stepId: commentData.results[0].target.step_details.id,
            doNotRefresh: true
          };

          if (isEmbedded) {
            dispatch(stepPreviewActions.getStepPreviewFields(stepTrack));
          } else {
            dispatch(workflowDetailsActions.getStepFields(stepTrack));
          }
        } else if (_.size(step_reload_payload)) {
          if (isEmbedded) {
            dispatch(
              stepPreviewActions.getStepPreviewFields(step_reload_payload)
            );
          } else {
            dispatch(workflowDetailsActions.getStepFields(step_reload_payload));
          }
        }
      },
      error => dispatch(failure(error))
    );
  };

  function success(data) {
    openNotificationWithIcon({
      type: "success",
      message: "Comment added",
      duration: 7
    });

    return { type: workflowCommentsConstants.ADD_COMMENTS_SUCCESS, data };
  }

  function failure(error) {
    const errorMessage =
      error.error || "Comment could not be posted at the moment";
    openNotificationWithIcon({
      type: "error",
      message: errorMessage,
      duration: 7
    });
    return { type: workflowCommentsConstants.ADD_COMMENTS_FAILURE, error };
  }
}

////////////////////
//Updating Flag //
////////////////////
function updateFlag(payload, isEmbedded) {
  return dispatch => {
    workflowStepService.updateFlag(payload).then(
      commentData => {
        commentData.isEmbedded = isEmbedded;
        dispatch(success(commentData));
        if (
          _.size(commentData.results) &&
          !commentData.results[0].target.workflow_details
        ) {
          const stepTrack = {
            workflowId: commentData.results[0].target.workflow,
            groupId: commentData.results[0].target.step_group_details.id,
            stepId: commentData.results[0].target.step_details.id,
            doNotRefresh: true
          };

          if (isEmbedded) {
            dispatch(stepPreviewActions.getStepPreviewFields(stepTrack));
          } else {
            dispatch(workflowDetailsActions.getStepFields(stepTrack));
          }
        }
      },
      error => dispatch(failure(error))
    );
  };

  function success(data) {
    openNotificationWithIcon({
      type: "success",
      message: "Flag updated!",
      duration: 7
    });

    return { type: workflowCommentsConstants.ADD_COMMENTS_SUCCESS, data };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to update",
      duration: 7
    });
    return { type: workflowCommentsConstants.ADD_COMMENTS_FAILURE, error };
  }
}

////////////////////
//Updating status //
////////////////////
function updateIntegrationStatus(payload, isEmbedded) {
  return dispatch => {
    workflowStepService.updateIntegrationStatus(payload).then(
      commentData => {
        commentData.isEmbedded = isEmbedded;
        dispatch(success(commentData));
        if (_.size(commentData.results)) {
          const stepTrack = {
            workflowId: commentData.results[0].target.workflow,
            groupId: commentData.results[0].target.step_group_details.id,
            stepId: commentData.results[0].target.step_details.id,
            doNotRefresh: true
          };

          if (isEmbedded) {
            dispatch(stepPreviewActions.getStepPreviewFields(stepTrack));
          } else {
            dispatch(workflowDetailsActions.getStepFields(stepTrack));
          }
        }
      },
      error => dispatch(failure(error))
    );
  };

  function success(data) {
    openNotificationWithIcon({
      type: "success",
      message: "Status updated!",
      duration: 7
    });

    return { type: workflowCommentsConstants.ADD_COMMENTS_SUCCESS, data };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Failed to update",
      duration: 7
    });
    return { type: workflowCommentsConstants.ADD_COMMENTS_FAILURE, error };
  }
}
