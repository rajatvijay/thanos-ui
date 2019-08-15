import { WORKFLOW_SEARCH_VALUE_CHANGE } from "../constants";

export default function workflowSearch(state = { searchValue: null }, action) {
  const { payload } = action;

  switch (action.type) {
    case WORKFLOW_SEARCH_VALUE_CHANGE:
      return { ...state, searchValue: payload };

    default:
      return state;
  }
}
