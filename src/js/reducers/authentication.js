import { userConstants } from "../constants";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? { loggedIn: true, user } : { loggedIn: false };

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: { ...action.user, csrf: null },
        error: null
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
        error: null
      };
    case userConstants.LOGIN_FAILURE:
      return {
        loggingIn: false,
        user: null,
        error: action.error
      };

    case userConstants.NORMAL_FAILURE:
      return {
        loggingIn: false,
        user: null,
        error: { NormalErr: action.error }
      };

    case userConstants.OTP_FAILURE:
      return {
        loggingIn: false,
        user: null,
        error: { OtpErr: action.error }
      };

    case userConstants.TOKEN_LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: { ...action.user, csrf: null },
        error: null
      };
    case userConstants.TOKEN_LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
        error: null
      };
    case userConstants.TOKEN_LOGIN_FAILURE:
      return {
        loggingIn: false,
        user: null,
        error: action.error
      };

    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
