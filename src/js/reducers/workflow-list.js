import data from "../data/data.js";

const initialState = {
  workflows: data,
  workflowsFetching: false,
  workflowsFetched: false
};

const workflowList = data;

export default (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_WORKFLOW_LIST_SUCCESSFUL":
      return Object.assign({}, state, {
        workflows: workflowList,
        worflowsFetched: true
      });
    case "FETCH_WORKFLOW_LIST_FAILED":
      return Object.assign({}, state, {
        workflows: {},
        workflowsFetched: false,
        workflowsFetchError: true
      });
    default:
      return state;
  }
};
