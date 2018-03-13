import { combineReducers } from "redux";
import loginReducer from "./login";
import usersReducer from "./users";
import workflowListReducer from "./workflow-list";
import workflowDetailsReducer from "./workflow-details";

const allReducers = combineReducers({
  loginUser: loginReducer,
  users: usersReducer,
  workflowList: workflowListReducer,
  workflowDetails: workflowDetailsReducer
});

export default allReducers;
