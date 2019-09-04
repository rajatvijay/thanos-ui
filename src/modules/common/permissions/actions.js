import { permissionConstants } from "./constants";
import { permissionService } from "./services";

function getPermissions() {
  return dispatch => {
    dispatch(request());

    permissionService
      .getPermissions()
      .then(
        permission => dispatch(success(permission)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: permissionConstants.PERMISSION_FETCH_REQUEST };
  }

  function success(permission) {
    return {
      type: permissionConstants.PERMISSION_FETCH_SUCCESS,
      permission
    };
  }
  function failure(error) {
    return { type: permissionConstants.PERMISSION_FETCH_FAILURE, error };
  }
}

export const permissionActions = {
  getPermissions
};
