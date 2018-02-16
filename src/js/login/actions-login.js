export const userLogin = user => {
  console.log(user);
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
