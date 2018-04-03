import { userConstants } from "../constants";
import { userService } from "../services";
import {
  logout as UserLogout,
  sendEmailAuthToken as userSendEmailAuthToken
} from "../services/user";
import { alertActions } from "./";
import { history } from "../_helpers";
import { notification } from "antd";

export const userActions = {
  register,
  getAll,
  delete: _delete
};

export const login = (username, password) => async dispatch => {
  dispatch({ type: userConstants.LOGIN_REQUEST, username });
  try {
    const response = await userService.login(username, password);
    dispatch({
      type: userConstants.LOGIN_SUCCESS,
      user: response
    });
    history.push("/");
  } catch (error) {
    dispatch({ type: userConstants.LOGIN_FAILURE, error });
    // dispatch(alertActions.error(error));
  }
};

export const logout = () => async dispatch => {
  try {
    const response = await UserLogout();
    dispatch({
      type: userConstants.LOGOUT
    });
    history.push("/login");
  } catch (error) {
    throw error;
  }
};

export const sendEmailAuthToken = email => async dispatch => {
  dispatch({ type: userConstants.LOGIN_LINK_REQUEST, email });
  try {
    const response = await userSendEmailAuthToken(email);

    dispatch({
      type: userConstants.LOGIN_LINK_SUCCESS,
      user: response
    });
    if (response.ok) {
      history.push("/");
    } else {
      notification["error"]({
        message: "Something went wrong.",
        description:
          "There was an error while submitting the form, please try again. If the proplem still persist pleas contact our team "
      });
    }
  } catch (error) {
    dispatch({ type: userConstants.LOGIN_LINK_FAILURE, error });
    // dispatch(alertActions.error(error));
  }
};

function register(user) {
  return dispatch => {
    dispatch(request(user));

    userService.register(user).then(
      user => {
        dispatch(success());
        history.push("/login");
        dispatch(alertActions.success("Registration successful"));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function getAll() {
  return dispatch => {
    dispatch(request());

    userService
      .getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id));

    userService.delete(id).then(
      user => {
        dispatch(success(id));
      },
      error => {
        dispatch(failure(id, error));
      }
    );
  };

  function request(id) {
    return { type: userConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: userConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: userConstants.DELETE_FAILURE, id, error };
  }
}
