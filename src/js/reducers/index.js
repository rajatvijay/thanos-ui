import { combineReducers } from "redux";

import { authentication } from "./authentication";
import { registration } from "./registration";
import { users, nextUrl } from "./users";
import { config } from "./config";
import { workflow, workflowChildren, expandedWorkflows } from "./workflow_list";
import { workflowCreate } from "./workflow_create";
import {
  workflowKind,
  workflowGroupCount,
  workflowAlertGroupCount,
  workflowKindStatus,
  workflowKindValue
} from "./workflow_kind";
import { workflowDetails, hasStepinfo } from "./workflow_details";
import { workflowDetailsHeader } from "./workflow_details_header";
import { workflowFilters, workflowFilterType } from "./workflow_filters";
import { currentStepFields } from "./workflow_step";
import { changeStatus } from "./change_status";
import { workflowComments } from "./workflow_comments";
import { stepVersionFields } from "./step_version";
import { languageSelector } from "./internationalize";
import { showFilterMenu, showPreviewSidebar } from "./navbar";
import { stepPreviewFields } from "./stepPreview";
import { userWorkflowModal } from "./user_workflow";
import taskQueueCount from "../modules/sidebar/sidebarReducer";
import stepUsers from "./stepBody";

//THIS IS THE STRUCTURE/STATE OF YOUR STORE//
const rootReducer = combineReducers({
  authentication,
  changeStatus,
  config,
  currentStepFields,
  expandedWorkflows,
  hasStepinfo,
  nextUrl,
  registration,
  stepVersionFields,
  showFilterMenu,
  stepPreviewFields,
  showPreviewSidebar,
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
  workflowAlertGroupCount,
  workflowKind,
  workflowKindStatus,
  workflowKindValue,
  languageSelector,
  userWorkflowModal,
  taskQueueCount,
  stepUsers
});

export default rootReducer;
