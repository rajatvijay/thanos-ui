import { combineReducers } from "redux";

import { authentication } from "./authentication";
import { registration } from "./registration";
import { users } from "./users";
import { config } from "./config";
import { workflow, workflowChildren } from "./workflow_list";
import { workflowCreate } from "./workflow_create";
import {
  workflowKind,
  workflowGroupCount,
  workflowKindStatus
} from "./workflow_kind";
import { workflowDetails, hasStepinfo } from "./workflow_details";
import { workflowDetailsHeader } from "./workflow_details_header";
import { workflowFilters, workflowFilterType } from "./workflow_filters";
import { currentStepFields } from "./workflow_step";
import { changeStatus } from "./change_status";
import { workflowComments } from "./workflow_comments";
import { stepVersionFields } from "./step_version";
import { languageSelector } from "./internationalize";

//THIS IS THE STRUCTURE/STATE OF YOUR STORE//
const rootReducer = combineReducers({
  authentication,
  changeStatus,
  config,
  currentStepFields,
  hasStepinfo,
  registration,
  stepVersionFields,
  users,
  workflow,
  workflowChildren,
  workflowComments,
  workflowCreate,
  workflowDetails,
  workflowDetailsHeader,
  workflowFilters,
  workflowFilterType,
  workflowGroupCount,
  workflowKind,
  workflowKindStatus,
  languageSelector
});

export default rootReducer;
