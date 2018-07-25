import {
  workflowDetailsConstants,
  workflowDetailsheaderConstants,
  workflowStepConstants,
  workflowCommentsConstants
} from "../constants";
import { workflowDetailsService } from "../services";
import _ from "lodash";
//import { alertActions } from "./";
//import { history } from "../_helpers";
import { notification, message } from "antd";

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
  getComment
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
        stepGroups => dispatch(success(stepGroups)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowDetailsConstants.GET_STEPGROUPS_REQUEST, id };
  }
  function success(stepGroups) {
    return {
      type: workflowDetailsConstants.GET_STEPGROUPS_SUCCESS,
      stepGroups
    };
  }
  function failure(error) {
    return { type: workflowDetailsConstants.GET_STEPGROUPS_FAILURE, error };
  }
}

//Get workflow step fileds data.
function getStepFields(step) {
  return dispatch => {
    if (!step.doNotRefresh) {
      dispatch(request(step));
    }

    workflowDetailsService
      .getStepFields(step)
      .then(
        stepFields => dispatch(success(stepFields)),
        error => dispatch(failure(error))
      );
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
  function failure(error) {
    return { type: workflowStepConstants.GET_STEPFIELDS_FAILURE, error };
  }
}

// Get workflow/step/field Comments
function getComment(object_id, content_type) {
  let payload = {
    object_id: object_id,
    type: content_type
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
        message: "No messages found!"
      });
    }
    return { type: workflowCommentsConstants.GET_COMMENTS_SUCCESS, data };
  }

  function failure(error) {
    return { type: workflowCommentsConstants.GET_COMMENTS_FAILURE, error };
  }
}
