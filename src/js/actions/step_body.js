import { workflowDetailsConstants } from "../constants";
import { workflowDetailsService } from "../services";
//import { alertActions } from "./";
//import { history } from "../_helpers";

export const workflowDetailsActions = {
  getById,
  getStepGroup,
  delete: _delete
};

//fetch step data and step fields data by id name
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

//fetch stepgroup  data i.e steps list
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

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id));

    workflowDetailsService.delete(id).then(
      workflowDetails => {
        dispatch(success(id));
      },
      error => {
        dispatch(failure(id, error));
      }
    );
  };

  function request(id) {
    return { type: workflowDetailsConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: workflowDetailsConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: workflowDetailsConstants.DELETE_FAILURE, id, error };
  }
}
