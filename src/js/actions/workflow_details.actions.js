import { workflowDetailsConstants } from "../constants";
import { userService } from "../services";
import { alertActions } from "./";
import { history } from "../_helpers";

export const workflowDetailsActions = {
  getAll,
  delete: _delete
};

function getAll() {
  return dispatch => {
    dispatch(request());

    workflowDetailsService
      .getAll()
      .then(
        workflowDetails => dispatch(success(workflowDetails)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowDetailsConstants.GETALL_REQUEST };
  }
  function success(workflowDetails) {
    return { type: workflowDetailsConstants.GETALL_SUCCESS, workflowDetails };
  }
  function failure(error) {
    return { type: workflowDetailsConstants.GETALL_FAILURE, error };
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
