import {
  workflowDetailsConstants,
  workflowDetailsheaderConstants,
  workflowStepConstants,
  workflowCommentsConstants,
  stepVersionConstants,
  SET_WORKFLOW_KEYS
} from "../constants";
import { stepBodyActions } from "./";
import { workflowDetailsService } from "../services";
import _ from "lodash";
import { history } from "../_helpers";
import { notification } from "antd";
import * as Sentry from "@sentry/browser";
import { currentActiveStep } from "../components/WorkflowDetails/utils/active-step";

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
  getStepFieldsTimer,
  getComment,
  getStepVersionFields,
  setCurrentStepId,
  removeCurrentStepId,
  archiveWorkflow
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
function getStepGroup(id, isActive) {
  return (dispatch, getState) => {
    dispatch(request(id));

    // workflowDetailsService
    workflowDetailsService.getStepGroup(id).then(
      stepGroups => {
        const { minimalUI } = getState();
        const { workflowId, stepId, groupId } = currentActiveStep(
          stepGroups,
          id
        );
        if (isActive && !minimalUI) {
          console.log("stepGroups", stepGroups, workflowId, stepId, groupId);
          history.replace(
            `/workflows/instances/${workflowId}?group=${groupId}&step=${stepId}`
          );
        } else {
          dispatch(
            getStepFields({
              workflowId,
              stepId,
              groupId
            })
          );
        }
        dispatch({
          type: SET_WORKFLOW_KEYS,
          payload: { workflowId, stepId, groupId }
        });
        dispatch(success(stepGroups, id));
      },
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
      //isActive
    };
  }
  function failure(error) {
    return { type: workflowDetailsConstants.GET_STEPGROUPS_FAILURE, error };
  }
}
let TIME_IN_MS = 2000;

function getStepFieldsTimer(step) {
  const workflowId = step.workflowId;
  const groupId = step.groupId;
  const stepId = step.stepId;

  console.log("here are steps", step);
  if (!workflowId || !groupId || !stepId) {
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
      .then(stepFields => {
        if (
          stepFields.definition.available_user_tags &&
          stepFields.definition.available_user_tags.some(
            item => item === "Assignee"
          )
        ) {
          dispatch(stepBodyActions.getAssignedUser(step.stepId));
        }
        setTimeout(function() {
          if (status_code === "fetching") {
            TIME_IN_MS *= 2;
            if (TIME_IN_MS === 32000) {
              return;
            }
            getStepFieldsTimer({ workflowId, groupId, stepId });
          }
          return;
        }, TIME_IN_MS);
        // console.log("fields", stepFields);
        return dispatch(success({ ...stepFields }));
      })
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
  // return setTimeout(function() {
  //   console.log("working");
  // }, 3000);
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
      .then(stepFields => {
        if (
          stepFields.definition.available_user_tags &&
          stepFields.definition.available_user_tags.some(
            item => item === "Assignee"
          )
        ) {
          dispatch(stepBodyActions.getAssignedUser(step.stepId));
        }
        console.log("fields", stepFields);
        return dispatch(success({ ...stepFields }));
      })
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
  const payload = {
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

function archiveWorkflow(id) {
  const postArchiveRedirect = () => {
    // TODO: Move to calling function rather than the action
    if (history.length > 2) {
      history.goBack();
    } else {
      // User has navigated straight to a workflow
      history.push("/workflows/instances/");
    }
  };

  return dispatch => {
    dispatch(request());

    workflowDetailsService.archiveWorkflow(id).then(
      response => {
        dispatch(success(response));
        postArchiveRedirect();
      },
      response => {
        dispatch(failure(response));
        setTimeout(function() {
          postArchiveRedirect();
        }, 1500);
      }
    );
  };

  function request() {
    return { type: workflowDetailsheaderConstants.ARCHIVE_REQUEST };
  }

  function success(response) {
    return { type: workflowDetailsheaderConstants.ARCHIVE_REQUEST_SUCCESS };
  }

  function failure(response) {
    if (response.status === 400) {
      openNotificationWithIcon({
        type: "error",
        message:
          "Possible misconfiguration of status'es mappings, please check with site admin"
      });
    }
    return {
      type: workflowDetailsheaderConstants.ARCHIVE_REQUEST_FAILURE,
      error: response.statusText
    };
  }
}
