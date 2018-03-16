//import api from "./api";

// export const userLoggegIn = (user) => ({
//   type : "USER_LOGGED_IN",
//   user
// })

// export const login = credentials => (dispatch)=>
//   api.user.login(credentials).then(user => dispatch(userLoggegIn(user)));

export const userLogin = user => {
  return {
    type: "LOGIN",
    payload: user
  };
};

export const userLoginSuccess = user => {
  return {
    type: "LOGIN_SUCCESS",
    payload: user
  };
};

export const userLoginFailed = () => {
  return {
    type: "LOGIN_FAILED"
  };
};

export const userLoggedOut = () => {
  return {
    type: "LOGOUT_SUCCESS"
  };
};
