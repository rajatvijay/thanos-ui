import { workflowDetailsConstants, workflowStepConstants } from "../constants";
import { workflowDetailsService } from "../services";
//import { alertActions } from "./";
//import { history } from "../_helpers";

export const workflowDetailsActions = {
  getById,
  getStepGroup
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
