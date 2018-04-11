import { workflowDetailsConstants } from "../constants";

export function workflowDetails(state = {}, action) {
  switch (action.type) {
    case workflowDetailsConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case workflowDetailsConstants.GETALL_SUCCESS:
      return {
        workflowDetails: action.workflowDetails
      };
    case workflowDetailsConstants.GETALL_FAILURE:
      return {
        error: action.error
      };

    case workflowDetailsConstants.GET_STEPGROUPS_REQUEST:
      return {
        loading: true
      };
    case workflowDetailsConstants.GET_STEPGROUPS_SUCCESS:
      return {
        loading: false,
        workflowDetails: { stepGroups: action.stepGroups }
      };
    case workflowDetailsConstants.GET_STEPGROUPS_FAILURE:
      return {
        error: action.error
      };

    // case workflowDetailsConstants.DELETE_REQUEST:
    //   // add 'deleting:true' property to user being deleted
    //   return {
    //     ...state,
    //     items: state.items.map(
    //       user => (user.id === action.id ? { ...user, deleting: true } : user)
    //     )
    //   };
    // case workflowDetailsConstants.DELETE_SUCCESS:
    //   // remove deleted user from state
    //   return {
    //     items: state.items.filter(user => user.id !== action.id)
    //   };
    // case workflowDetailsConstants.DELETE_FAILURE:
    //   // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    //   return {
    //     ...state,
    //     items: state.items.map(user => {
    //       if (user.id === action.id) {
    //         // make copy of user without 'deleting:true' property
    //         const { deleting, ...userCopy } = user;
    //         // return copy of user with 'deleteError:[error]' property
    //         return { ...userCopy, deleteError: action.error };
    //       }

    //       return user;
    //     })
    //   };

    default:
      return state;
  }
}
