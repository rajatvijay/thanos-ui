import { SET_WORKFLOW_KEYS } from "../constants/workflowKeys";

export function setWorkflowKeys(keys) {
  return { type: SET_WORKFLOW_KEYS, payload: keys };
}
