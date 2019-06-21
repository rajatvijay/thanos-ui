import {
  workflowDetailsConstants,
  workflowDetailsheaderConstants,
  workflowStepConstants,
  workflowCommentsConstants,
  stepVersionConstants
} from "../constants";
import { workflowDetailsService } from "../services";
import _ from "lodash";
//import { history } from "../_helpers";
import { notification, message } from "antd";
import Sentry from "@sentry/browser";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export const workflowDetailsActions = {
  getById,
  getStepGroup,
  getStepFields,
  getComment,
  getStepVersionFields,
  setCurrentStepId,
  removeCurrentStepId
};

//Get workflow details
function getById(id) {
  return dispatch => {
    dispatch(request());

    workflowDetailsService
      .getById(id)
      .then(
        workflowDetails => dispatch(success(workflowDetails)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowDetailsheaderConstants.GET_REQUEST };
  }
  function success(workflowDetails) {
    return {
      type: workflowDetailsheaderConstants.GET_SUCCESS,
      workflowDetails
    };
  }
  function failure(error) {
    return { type: workflowDetailsheaderConstants.GET_FAILURE, error };
  }
}

//Get workflow step groups and steps list.
function getStepGroup(id) {
  return dispatch => {
    dispatch(request(id));

    workflowDetailsService
      .getStepGroup(id)
      .then(
        stepGroups => dispatch(success(stepGroups, id)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowDetailsConstants.GET_STEPGROUPS_REQUEST, id };
  }
  function success(stepGroups, id) {
    return {
      type: workflowDetailsConstants.GET_STEPGROUPS_SUCCESS,
      stepGroups,
      id
    };
  }
  function failure(error) {
    return { type: workflowDetailsConstants.GET_STEPGROUPS_FAILURE, error };
  }
}

//Get workflow step fileds data.
function getStepFields(step) {
  // For Error tracking
  if (!step.workflowId || !step.groupId || !step.stepId) {
    Sentry.captureException(
      new Error(`Get steps field called ${JSON.stringify(step)}`)
    );
    return () => {};
  }
  return dispatch => {
    if (!step.doNotRefresh) {
      dispatch(request(step));
    }

    workflowDetailsService
      .getStepFields(step)
      .then(stepFields => dispatch(success({ ...stepFields })))
      .catch(e => {
        dispatch(failure(e, step));
      });
  };

  function request(step) {
    return { type: workflowStepConstants.GET_STEPFIELDS_REQUEST, step };
  }
  function success(stepFields, step) {
    return {
      type: workflowStepConstants.GET_STEPFIELDS_SUCCESS,
      stepFields,
      step
    };
  }
  function failure(error, step) {
    return { type: workflowStepConstants.GET_STEPFIELDS_FAILURE, error, step };
  }
}

// Get workflow/step/field Comments
function getComment(object_id, content_type, addtn, isEmbedded) {
  let payload = {
    object_id: object_id,
    type: content_type,
    extra: addtn
  };

  return dispatch => {
    dispatch(request(payload));
    if (payload.object_id) {
      workflowDetailsService
        .getComments(payload)
        .then(
          commentData => dispatch(success(commentData)),
          error => dispatch(failure(error))
        );
    }
  };

  function request(payload) {
    return { type: workflowCommentsConstants.GET_COMMENTS_REQUEST, payload };
  }

  function success(data) {
    if (!_.size(data.results)) {
      openNotificationWithIcon({
        type: "error",
        message: "This feature is disabled."
      });
    }
    data.isEmbedded = isEmbedded;
    return { type: workflowCommentsConstants.GET_COMMENTS_SUCCESS, data };
  }

  function failure(error) {
    return { type: workflowCommentsConstants.GET_COMMENTS_FAILURE, error };
  }
}

//Get workflow step  Version fileds data.
function getStepVersionFields(step) {
  return dispatch => {
    if (!step.doNotRefresh) {
      dispatch(request(step));
    }

    workflowDetailsService
      .getStepVersionFields(step)
      .then(
        stepVersionFields => dispatch(success(stepVersionFields)),
        error => dispatch(failure(error))
      );
  };

  function request(step) {
    return { type: stepVersionConstants.GET_VERSION_REQUEST, step };
  }
  function success(stepVersionFields, step) {
    return {
      type: stepVersionConstants.GET_VERSION_SUCCESS,
      stepVersionFields,
      step
    };
  }
  function failure(error) {
    return { type: stepVersionConstants.GET_VERSION_FAILURE, error };
  }
}

//url has step info
function setCurrentStepId(payload) {
  return { type: workflowDetailsConstants.SET_STEP_ID, payload };
}

//url has step info
function removeCurrentStepId() {
  return { type: workflowDetailsConstants.REMOVE_STEP_ID };
}
