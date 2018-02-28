import { combineReducers } from "redux";
import loginReducer from "../login/reducer-login";
import user from "../users/reducer-user";

const allReducers = combineReducers({
  loginUser: loginReducer,
  user: user
});

export default allReducers;
