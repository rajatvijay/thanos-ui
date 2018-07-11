import { workflowCommentsConstants } from "../constants";

export function workflowComments(state = {}, action) {
  switch (action.type) {
    // Get Comments
    case workflowCommentsConstants.GET_COMMENTS_REQUEST:
      return {
        loading_data: true,
        data: {}
      };
    case workflowCommentsConstants.GET_COMMENTS_SUCCESS:
      return {
        loading_data: false,
        data: action.data
      };
    case workflowCommentsConstants.GET_COMMENTS_FAILURE:
      return {
        loading_data: false,
        error: action.error
      };

    // Add Comments
    case workflowCommentsConstants.ADD_COMMENTS_REQUEST:
      return {
        adding_comment: true
      };
    case workflowCommentsConstants.ADD_COMMENTS_SUCCESS:
      return {
        adding_comment: false,
        data: action.data
      };
    case workflowCommentsConstants.ADD_COMMENTS_FAILURE:
      return {
        adding_comment: false,
        error: action.error
      };

    default:
      return state;
  }
}
