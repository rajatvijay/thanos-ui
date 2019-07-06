import { stepBody } from "../constants";

const {
  GET_STEP_USERS_LOADING,
  GET_STEP_USERS_SUCCESS,
  GET_STEP_USERS_FAILURE,
  POST_STEP_USER_SUCCESS,
  POST_STEP_USER_FAILURE,
  POST_STEP_USER_LOADING,
  DELETE_STEP_USER_FAILURE,
  DELETE_STEP_USER_LOADING,
  DELETE_STEP_USER_SUCCESS
} = stepBody;

export default function stepUsers(state = {}, action) {
  const { type, payload, stepId } = action;

  switch (type) {
    case GET_STEP_USERS_LOADING:
      return { ...state, [stepId]: { isLoading: true, disabled: false } };

    case GET_STEP_USERS_SUCCESS:
      return { ...state, [stepId]: { data: payload, isLoading: false } };

    case GET_STEP_USERS_FAILURE:
      return {
        ...state,
        [stepId]: { ...state[stepId], err: payload, isLoading: false }
      };

    case POST_STEP_USER_LOADING:
      return {
        ...state,
        [stepId]: { ...state[stepId], isLoading: true, display: true }
      };

    case POST_STEP_USER_SUCCESS:
      return {
        ...state,
        [stepId]: {
          ...state[stepId],
          isLoading: false,
          user: payload,
          disabled: true
        }
      };

    case POST_STEP_USER_FAILURE:
      return {
        ...state,
        [stepId]: { ...state[stepId], isLoading: false, err: payload }
      };

    case DELETE_STEP_USER_LOADING:
      return { ...state, [stepId]: { ...state[stepId], isLoading: true } };
    case DELETE_STEP_USER_SUCCESS:
      return {
        ...state,
        [stepId]: {
          ...state[stepId],
          isLoading: false,
          user: null,
          disabled: false
        }
      };
    case DELETE_STEP_USER_FAILURE:
      return {
        ...state,
        [stepId]: { ...state[stepId], isLoading: false, err: payload }
      };

    default:
      return state;
  }
}
