import { SET_WORKFLOW_KEYS } from "../constants";

export default function workflowKeys(state = {}, action) {
  const { type, payload } = action;

  switch (action.type) {
    case SET_WORKFLOW_KEYS:
      const { workflowId, stepId, groupId } = payload;

      return { ...state, [workflowId]: { stepId, groupId } };
      return state;
    default:
      return state;
  }
}
