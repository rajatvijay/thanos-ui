//import { authHeader, baseUrl } from "../_helpers";
import { stepBodyService } from "../services";
import { stepBody } from "../constants";

const {
  GET_STEP_USERS_SUCCESS,
  GET_STEP_USERS_FAILURE,
  GET_STEP_USERS_LOADING,
  POST_STEP_USER_SUCCESS,
  POST_STEP_USER_LOADING,
  POST_STEP_USER_FAILURE,
  DELETE_STEP_USER_FAILURE,
  DELETE_STEP_USER_SUCCESS,
  DELETE_STEP_USER_LOADING,
  GET_ASSIGNED_USER_LOADING,
  GET_ASSIGNED_USER_SUCCESS,
  GET_ASSIGNED_USER_FAILURE
} = stepBody;

const postStepUser = obj => async dispatch => {
  dispatch({ type: POST_STEP_USER_LOADING, stepId: obj.step });

  try {
    const res = await stepBodyService.postStepUser({ ...obj, tag: "Assignee" });

    dispatch({
      type: POST_STEP_USER_SUCCESS,
      payload: res,
      stepId: obj.step
    });
  } catch (err) {
    dispatch({
      type: POST_STEP_USER_FAILURE,
      payload: err,
      stepId: obj.step
    });
  }
};

export const getStepUsers = stepId => async dispatch => {
  dispatch({ type: GET_STEP_USERS_LOADING, stepId });

  try {
    const res = await stepBodyService.getStepUsers(stepId);

    dispatch({ type: GET_STEP_USERS_SUCCESS, payload: res, stepId });
  } catch (err) {
    dispatch({ type: GET_STEP_USERS_FAILURE, payload: err, stepId });
  }
};

const deleteStepUser = (stepId, id) => async dispatch => {
  dispatch({ type: DELETE_STEP_USER_LOADING, stepId: stepId });

  try {
    const res = await stepBodyService.deleteStepUser(id);

    dispatch({ type: DELETE_STEP_USER_SUCCESS, stepId });
    dispatch(getStepUsers(stepId));
  } catch (err) {
    dispatch({ type: DELETE_STEP_USER_FAILURE, payload: err, stepId });
  }
};

const getAssignedUser = stepId => async dispatch => {
  dispatch({ type: POST_STEP_USER_LOADING, stepId: stepId });

  try {
    const res = await stepBodyService.getAssignedUser(stepId);

    if (res.results.length) {
      dispatch({
        type: POST_STEP_USER_SUCCESS,
        payload: res.results[0],
        stepId: stepId
      });
    } else {
      dispatch(getStepUsers(stepId));
    }
  } catch (err) {
    dispatch({ type: POST_STEP_USER_FAILURE, payload: err, stepId });
  }
};

export const stepBodyActions = {
  getStepUsers,
  postStepUser,
  deleteStepUser,
  getAssignedUser
};
