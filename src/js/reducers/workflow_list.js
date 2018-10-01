import { workflowConstants } from "../constants";
const initialState = {
  loading: false,
  workflow: {},
  count: 0
};

export function workflow(state = {}, action) {
  switch (action.type) {
    //GET ALL THE WORKFLOWS
    case workflowConstants.GETALL_REQUEST:
      return {
        loading: true,
        search: false
      };
    case workflowConstants.GETALL_SUCCESS:
      workflow = action.workflow;
      return {
        search: false,
        loading: false,
        workflow: workflow.results,
        count: workflow.count,
        next: workflow.next,
        previous: workflow.previous
      };
    case workflowConstants.GETALL_FAILURE:
      console.log("failed to load ");
      return {
        search: false,
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };

    //SEARCH LIST
    case workflowConstants.SEARCH_REQUEST:
      return {
        loading: true,
        search: true
      };
    case workflowConstants.SEARCH_SUCCESS:
      workflow = action.workflow;
      return {
        search: true,
        loading: false,
        workflow: workflow.results,
        count: workflow.count,
        next: workflow.next,
        previous: workflow.previous
      };
    case workflowConstants.SEARCH_FAILURE:
      console.log("failed to load ");
      return {
        search: true,
        loading: false,
        workflow: null,
        loadingStatus: "failed",
        error: action.error
      };

    //CREATE WORKFLOW
    case workflowConstants.CREATE_REQUEST:
      return {
        loading: true
      };
    case workflowConstants.CREATE_SUCCESS:
      return {
        loading: false,
        workflow: action.workflow
      };
    case workflowConstants.CREATE_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };

    //GET SINGLE WORKFLOW BY ID
    case workflowConstants.GET_REQUEST:
      return {
        loading: true
      };

    case workflowConstants.GET_SUCCESS:
      return {
        loading: false,
        workflow: action.workflow
      };

    case workflowConstants.GET_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}

const initialStateChildWorkflow = {
  //loading: false,
};

export function workflowChildren(state = {}, action) {
  switch (action.type) {
    //GET ALL THE WORKFLOWS
    case workflowConstants.GET_CHILD_REQUEST:
      return {
        ...state,
        ...action.response
      };
    case workflowConstants.GET_CHILD_SUCCESS:
      return {
        ...state,
        ...action.response
      };
    case workflowConstants.GET_CHILD_FAILURE:
      console.log("failed to load ");
      return {
        ...state,
        ...action.response
      };

    default:
      return state;
  }
}
