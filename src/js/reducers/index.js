import { combineReducers } from "redux";

import { authentication } from "./authentication";
import { registration } from "./registration";
import { users } from "./users";
import { alert } from "./alert";
import { workflow } from "./workflow_list";
import { workflowDetails } from "./workflow_details";

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert
});

export default rootReducer;
