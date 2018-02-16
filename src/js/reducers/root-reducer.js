import { combineReducers } from "redux";
import loginReducer from "../login/reducer-login";
import usersReducer from "../users/reducer-user";

const allReducers = combineReducers({
  loginUser: loginReducer,
  usersReducer: usersReducer
});

export default allReducers;
