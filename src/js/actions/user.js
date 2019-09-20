import { userConstants } from "../constants";
import { userService } from "../services";
import {
  logout as userLogout,
  sendEmailAuthToken as userSendEmailAuthToken
} from "../services/user";
import { history } from "../_helpers";
import { notification } from "antd";
import { userUtilities } from "../utils/user";

export const userActions = {
  register,
  getAll,
  getById,
  delete: _delete,
  setNextUrl
};

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export const login = (username, password, token) => async dispatch => {
  dispatch({ type: userConstants.LOGIN_REQUEST, username });
  try {
    const response = await userService.login(username, password, token);
    dispatch({
      type: userConstants.LOGIN_SUCCESS,
      user: response
    });

    dispatch({
      type: userConstants.GETME_SUCCESS,
      user: response
    });

    history.push("/");
  } catch (error) {
    dispatch({
      type: userConstants.NORMAL_FAILURE,
      error: error.detail ? error.detail : "Failed to fetch"
    });
    dispatch({ type: userConstants.GETME_FAILURE, error });
  }
};

export const loginOtp = (username, password) => async dispatch => {
  dispatch({ type: userConstants.LOGIN_REQUEST, username });
  try {
    const response = await userService.loginOtp(username, password);
    dispatch({
      type: userConstants.LOGIN_SUCCESS,
      user: response
    });

    dispatch({
      type: userConstants.GETME_SUCCESS,
      user: response
    });

    history.push("/");
  } catch (error) {
    dispatch({
      type: userConstants.OTP_FAILURE,
      error: error.detail ? error.detail : "Failed to fetch"
    });
    dispatch({ type: userConstants.GETME_FAILURE, error });
  }
};

export const tokenLogin = (token, next) => async dispatch => {
  dispatch({ type: userConstants.TOKEN_LOGIN_REQUEST, token });
  try {
    const response = await userService.tokenLogin(token, next);
    dispatch({
      type: userConstants.TOKEN_LOGIN_SUCCESS,
      user: response
    });

    dispatch({
      type: userConstants.GETME_SUCCESS,
      user: response
    });
  } catch (error) {
    dispatch({ type: userConstants.TOKEN_LOGIN_FAILURE, error });
    dispatch({ type: userConstants.GETME_FAILURE, error });
  }
};

export const logout = () => async dispatch => {
  try {
    const response = await userLogout();
    dispatch({ type: userConstants.LOGOUT });
    userUtilities.postLogoutAction({ redirectURL: response.redirect_url });
  } catch (err) {
    dispatch({ type: userConstants.LOGOUT_FAILURE });
  }
};

export const sendEmailAuthToken = (email, nextUrl) => async dispatch => {
  dispatch({ type: userConstants.LOGIN_LINK_REQUEST, email, nextUrl });
  try {
    const response = await userSendEmailAuthToken(email, nextUrl);

    dispatch({
      type: userConstants.LOGIN_LINK_SUCCESS,
      user: response
    });
    if (response.ok) {
      history.push("/");
    } else {
      response.json().then(data => {
        const genericMessage =
          "There was an error while submitting the form, please try again. If the problem still persists please contact our team ";
        openNotificationWithIcon({
          type: "error",
          message: "Something went wrong.",
          body: data.detail || genericMessage
        });
      });
    }
  } catch (error) {
    dispatch({ type: userConstants.LOGIN_LINK_FAILURE, error });
  }
};

export const checkAuth = () => async dispatch => {
  dispatch({ type: userConstants.GETME_REQUEST });
  try {
    const response = await userService.checkAuth();

    dispatch({
      type: userConstants.LOGIN_SUCCESS,
      user: response
    });

    dispatch({
      type: userConstants.GETME_SUCCESS,
      user: response
    });

    if (
      window.location.pathname === "/login/basic" ||
      window.location.pathname === "/login/magic" ||
      window.location.pathname === "/login"
    ) {
      history.push("/");
    }
  } catch (error) {
    dispatch({ type: userConstants.GETME_FAILURE, error });
  }
};

function register(user) {
  return dispatch => {
    dispatch(request(user));

    userService.register(user).then(
      user => {
        dispatch(success());
        history.push("/login");
      },
      error => {
        dispatch(failure(error));
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

function getById(id) {
  return dispatch => {
    dispatch(request(id));

    userService
      .getById(id)
      .then(user => dispatch(success(user)), error => dispatch(failure(error)));
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

//SETNEXTURL
function setNextUrl(nextUrl) {
  return dispatch => {
    dispatch({ type: userConstants.SET_NEXT_URL, nextUrl });
  };
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
