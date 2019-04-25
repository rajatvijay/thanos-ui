import { workflowConstants } from "../constants";

export function userWorkflowModal(state = { visible: false }, action) {
  switch (action.type) {
    case workflowConstants.SHOW_USER_WORKFLOW_MODAL:
      return { visible: true, workflowID: action.workflowID };
    case workflowConstants.HIDE_USER_WORKFLOW_MODAL:
      return { visible: false, workflowID: action.workflowID };
    default:
      return state;
  }
}
