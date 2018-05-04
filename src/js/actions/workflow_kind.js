import { workflowKindConstants } from "../constants";
import { workflowKindService } from "../services";

export const workflowKindActions = {
  getAll,
  getCount
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

function getCount(tag) {
  return dispatch => {
    dispatch(request(tag));

    workflowKindService
      .getCount(tag)
      .then(
        workflowGroupCount => dispatch(success(workflowGroupCount.results)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowKindConstants.GETALL_REQUEST };
  }
  function success(workflowGroupCount) {
    return { type: workflowKindConstants.GETALL_SUCCESS, workflowGroupCount };
  }
  function failure(error) {
    return { type: workflowKindConstants.GETALL_FAILURE, error };
  }
}
