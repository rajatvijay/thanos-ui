import { workflowConstants } from "../constants";

export function workflow(state = {}, action) {
  switch (action.type) {
    //GET ALL THE WORKFLOWS
    case workflowConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case workflowConstants.GETALL_SUCCESS:
      return {
        loading: false,
        workflow: action.workflow
      };
    case workflowConstants.GETALL_FAILURE:
      console.log("failed to load ");
      return {
        loading: false,
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
