import { userConstants } from "../constants";

const initialState = {
  formState: {
    username: "",
    password: ""
  },
  emailAuth: {
    email: "",
    submitted: false,
    data: {},
    loading: false,
    errors: {}
  },
  loading: false,
  items: {},
  error: null
};

export function users(state = initialState, action) {
  switch (action.type) {
    //MAGIC LINK
    case userConstants.LOGIN_LINK_REQUEST:
      return {
        ...state,
        emailAuth: { ...state.emailAuth, loading: true }
      };
    case userConstants.LOGIN_LINK_SUCCESS:
      if (action.user.ok) {
        return {
          ...state,
          emailAuth: { ...state.emailAuth, loading: false, submitted: true }
        };
      } else {
        return {
          ...state,
          emailAuth: {
            ...state.emailAuth,
            loading: false,
            submitted: false,
            error: true
          }
        };
      }
    case userConstants.LOGIN_LINK_FAILURE:
      return {
        ...state,
        emailAuth: { ...state.emailAuth, loading: false, errors: action.error }
      };

    //GET LIST OF ALL USERS
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return {
        error: action.error
      };

    // GET USER BY ID
    case userConstants.GET_REQUEST:
      return {
        loading: true
      };
    case userConstants.GET_SUCCESS:
      return {
        items: action.requestedUser,
        loading: false
      };
    case userConstants.GET_FAILURE:
      return {
        error: action.error,
        loading: false
      };

    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(
          user => (user.id === action.id ? { ...user, deleting: true } : user)
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        })
      };

    //get authenticated use
    case userConstants.GETME_REQUEST:
      return {
        ...state,
        me: { loading: true }
      };
    case userConstants.GETME_SUCCESS:
      return {
        ...state,
        me: { loading: false, ...action.users }
      };
    case userConstants.GETME_FAILURE:
      return {
        ...state,
        me: { loading: false, error: action.error }
      };

    default:
      return state;
  }
}
