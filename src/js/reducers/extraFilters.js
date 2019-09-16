import { workflowConstants } from "../constants";

const initialState = {};

// FUCNTION FOR FILTERING THE WORKFLOW WITH THE FILTER OPTION ON THE LEFT SIDEBAR.
export function extraFilters(state = initialState, action) {
  switch (action.type) {
    case workflowConstants.UPDATE_PARENT_EXTRA_FILTER:
      const { extraFilters, workflowId } = action;
      return {
        ...state,
        [workflowId]: extraFilters
      };

    default:
      return state;
  }
}
