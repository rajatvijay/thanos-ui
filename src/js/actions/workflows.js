import { workflowConstants } from "../constants";
import { workflowService } from "../services";
import { alertActions } from "./";
import { history } from "../_helpers";

export const workflowActions = {
  getAll,
  delete: _delete
};

function getAll() {
  return dispatch => {
    dispatch(request());

    workflowService
      .getAll()
      .then(
        workflow => dispatch(success(workflow.results)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowConstants.GETALL_REQUEST };
  }
  function success(workflow) {
    return { type: workflowConstants.GETALL_SUCCESS, workflow };
  }
  function failure(error) {
    return { type: workflowConstants.GETALL_FAILURE, error };
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id));

    workflowService.delete(id).then(
      workflow => {
        dispatch(success(id));
      },
      error => {
        dispatch(failure(id, error));
      }
    );
  };

  function request(id) {
    return { type: workflowConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: workflowConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: workflowConstants.DELETE_FAILURE, id, error };
  }
}
