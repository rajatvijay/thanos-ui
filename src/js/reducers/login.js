// const initialState = {
//   user_id: null,
//   username: "",
//   userAuthenticated: false
// };

export default (state = {}, action = {}) => {
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
    case "USER_LOGGED_IN":
      return action.user;
    default:
      return state;
  }
};
