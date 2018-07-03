import { combineReducers } from "redux";

import { authentication } from "./authentication";
import { registration } from "./registration";
import { users } from "./users";
import { config } from "./config";
import { alert } from "./alert";
import { workflow } from "./workflow_list";
import { workflowCreate } from "./workflow_create";
import { workflowKind, workflowGroupCount } from "./workflow_kind";
import { workflowDetails } from "./workflow_details";
import { workflowFilters, workflowFilterType } from "./workflow_filters";
import { currentStepFields } from "./workflow_step";
import { changeStatus } from "./change_status";

//THIS IS THE STRUCTURE/STATE OF YOUR STORE//
const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  config,
  alert,
  workflow,
  workflowKind,
  workflowGroupCount,
  workflowDetails,
  workflowCreate,
  currentStepFields,
  workflowFilters,
  workflowFilterType,
  changeStatus
});

export default rootReducer;
