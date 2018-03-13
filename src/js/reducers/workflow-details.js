import data from "../data/data-details.js";

const initialState = {
  workflowDetails: data,
  workflowDetailsFetching: false,
  workflowDetailsFetched: false
};

const workflowDetails = data;

export default (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_WORKFLOW_DATA_SUCCESSFUL":
      return Object.assign({}, state, {
        workflowDetails: workflowDetails,
        workflowDetailsFetched: true
      });
    case "FETCH_WORKFLOW_DATA_FAILED":
      return Object.assign({}, state, {
        workflowDetails: {},
        workflowDetailsFetched: false,
        workflowDetailsFetchError: true
      });
    default:
      return state;
  }
};
