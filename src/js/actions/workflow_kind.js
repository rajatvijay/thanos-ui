import { workflowKindConstants } from "../constants";
import { workflowKindService } from "../services";

export const workflowKindActions = {
  getAll,
  getCount,
  getAlertCount,
  setValue
};

function getAll() {
  return dispatch => {
    dispatch(request());

    workflowKindService
      .getAll()
      .then(
        workflowKind => dispatch(success(workflowKind.results)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowKindConstants.GETALL_REQUEST };
  }
  function success(workflowKind) {
    return { type: workflowKindConstants.GETALL_SUCCESS, workflowKind };
  }
  function failure(error) {
    return { type: workflowKindConstants.GETALL_FAILURE, error };
  }
}

//get workflow agrrated filter data i.e group counts
function getAlertCount(tag) {
  return dispatch => {
    dispatch(request(tag));

    workflowKindService
      .getAlertCount(tag)
      .then(
        workflowAlertGroupCount => dispatch(success(workflowAlertGroupCount)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowKindConstants.GET_ALERT_COUNT_REQUEST };
  }
  function success(workflowAlertGroupCount) {
    return {
      type: workflowKindConstants.GET_ALERT_COUNT_SUCCESS,
      workflowAlertGroupCount
    };
  }
  function failure(error) {
    return { type: workflowKindConstants.GET_ALERT_COUNT_FAILURE, error };
  }
}

function getCount(tag) {
  return dispatch => {
    dispatch(request(tag));

    workflowKindService
      .getCount(tag)
      .then(
        workflowGroupCount => dispatch(success(workflowGroupCount)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowKindConstants.GET_COUNT_REQUEST };
  }
  function success(workflowGroupCount) {
    return {
      type: workflowKindConstants.GET_COUNT_SUCCESS,
      workflowGroupCount
    };
  }
  function failure(error) {
    return { type: workflowKindConstants.GET_COUNT_FAILURE, error };
  }
}

function setValue(kind) {
  return dispatch => {
    dispatch({ type: workflowKindConstants.SET_VALUE, payload: kind });
  };
}
