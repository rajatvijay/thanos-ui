import { combineReducers } from "redux";

import { authentication } from "./authentication";
import { registration } from "./registration";
import { users } from "./users";
import { alert } from "./alert";
import { workflow } from "./workflow_list";
import { workflowCreate } from "./workflow_create";
import { workflowKind } from "./workflow_kind";
import { workflowDetails } from "./workflow_details";

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  workflow,
  workflowKind,
  workflowDetails,
  workflowCreate
});

export default rootReducer;
