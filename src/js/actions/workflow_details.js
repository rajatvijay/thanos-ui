import { workflowDetailsConstants, workflowStepConstants } from "../constants";
import { workflowDetailsService } from "../services";
//import { alertActions } from "./";
//import { history } from "../_helpers";

export const workflowDetailsActions = {
  getById,
  getStepGroup,
  getStepFields
};

//Get workflow details
function getById() {
  return dispatch => {
    dispatch(request());

    workflowDetailsService
      .getById()
      .then(
        workflowDetails => dispatch(success(workflowDetails)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowDetailsConstants.GET_REQUEST };
  }
  function success(workflowDetails) {
    return { type: workflowDetailsConstants.GET_SUCCESS, workflowDetails };
  }
  function failure(error) {
    return { type: workflowDetailsConstants.GET_FAILURE, error };
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
    dispatch(request(step));

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
