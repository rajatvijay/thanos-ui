const initialState = {
  user_id: null,
  username: "",
  userAuthenticated: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return Object.assign({}, state, {
        user_id: 1,
        username: "junaid",
        userAuthenticated: true
      });
    case "LOGIN_FAILED":
      return Object.assign({}, state, {
        user_id: null,
        username: "",
        userAuthenticated: false
      });
    case "LOGOUT_SUCCESSFUL":
      return Object.assign({}, state, {
        user_id: null,
        username: "",
        userAuthenticated: false
      });
    default:
      return state;
  }
};
