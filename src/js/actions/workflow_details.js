import {
  workflowDetailsConstants,
  workflowDetailsheaderConstants,
  workflowStepConstants,
  workflowCommentsConstants,
  stepVersionConstants
} from "../constants";
import { stepBodyActions } from "./";
import { workflowDetailsService } from "../services";
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

    // Returning promise here, so that
    // I can use .then from the component
    return workflowDetailsService.getById(id).then(
      workflowDetails => {
        dispatch(success(workflowDetails));
        return workflowDetails;
      },
      error => {
        dispatch(failure(error));
        throw error;
      }
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
    return workflowDetailsService.getStepGroup(id).then(
      stepGroups => {
        const { minimalUI } = getState();
        const { workflowId, stepId, groupId } = currentActiveStep(
          stepGroups,
          id
        );
        if (isActive && !minimalUI) {
          history.replace(
            `/workflows/instances/${workflowId}?group=${groupId}&step=${stepId}`
          );
        }
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

//Get workflow step fileds data.
// TODO: Refactor this into 2 separate functions
// one for polling and other normal one that call single service function
// This should be taken up when refactoring the data layer of the app
function getStepFields(step, polling, fieldId) {
  // For Error tracking
  if (!step.workflowId || !step.groupId || !step.stepId) {
    Sentry.captureException(
      new Error(`Get steps field called ${JSON.stringify(step)}`)
    );
    return () => {};
  }

  // Polling Case
  if (polling) {
    return pollGetStepFields;
  }

  // General case w/o polling
  return dispatch => {
    if (!step.doNotRefresh) {
      dispatch(request(step));
    }

    workflowDetailsService
      .getStepFields(step)
      .then(stepFields => {
        onSuccessfullResponse(stepFields, dispatch);
      })
      .catch(e => {
        onFailureResponse(e, dispatch);
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
  function onSuccessfullResponse(stepFields, dispatch) {
    if (
      stepFields.definition.available_user_tags &&
      stepFields.definition.available_user_tags.some(
        item => item === "Assignee"
      )
    ) {
      dispatch(stepBodyActions.getAssignedUser(step.stepId));
    }
    return dispatch(success({ ...stepFields }));
  }
  function failure(error, step) {
    return { type: workflowStepConstants.GET_STEPFIELDS_FAILURE, error, step };
  }
  function onFailureResponse(error, dispatch) {
    dispatch(failure(error, step));
  }
  function pollGetStepFields(dispatch) {
    let incrementalPollingCounter = 1;
    function callStepFieldsAPI() {
      workflowDetailsService
        .getStepFields(step)
        .then(stepFields => {
          // onSuccessfullResponse(stepFields, dispatch);
          const currentField = stepFields.data_fields.find(
            field => field.id === fieldId
          );
          onSuccessfullResponse(stepFields, dispatch);
          if (
            currentField.integration_json.status_code === "fetching" &&
            incrementalPollingCounter < 32
          ) {
            setTimeout(callStepFieldsAPI, incrementalPollingCounter * 1000);
            incrementalPollingCounter *= 2;
          } else {
            incrementalPollingCounter = 1;
          }
        })
        .catch(e => {
          onFailureResponse(e, dispatch);
        });
    }
    callStepFieldsAPI();
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
