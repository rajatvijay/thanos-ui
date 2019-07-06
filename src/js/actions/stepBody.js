import { authHeader, baseUrl } from "../_helpers";
import axios from "axios";
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
  dispatch({ type: POST_STEP_USER_LOADING, stepId: obj.stepId });

  //   const res = await axios.post(`${baseUrl}api/v1/step-user-tags`, obj, {
  //     credentials: "include",
  //     header: {
  //       headers: authHeader.get()
  //     }
  //   });

  const res = await new Promise(function(resolve, reject) {
    resolve({
      payload: {
        id: 1, // this resource id
        tag: "responsible",
        step: 1,
        user: {
          name: "Rajat",
          email: "rajat@gmail.com"
        }
      }
    });
  });
  console.log("resget", res);

  try {
    dispatch({
      type: POST_STEP_USER_SUCCESS,
      payload: res.payload,
      stepId: obj.stepId
    });
  } catch (err) {
    dispatch({
      type: POST_STEP_USER_FAILURE,
      payload: err,
      stepId: obj.stepId
    });
  }
};

export const getStepUsers = stepId => async dispatch => {
  // const res = await axios.get(`${baseUrl}api/v1/steps/${stepId}/get-users-with-edit-access/`,{
  //         credentials: "include",
  //         headers: {
  //           headers: authHeader.get()
  //         }
  // });
  dispatch({ type: GET_STEP_USERS_LOADING, stepId });

  const res = await new Promise(function(resolve, reject) {
    resolve({
      payload: [
        {
          id: 1,
          email: "sai@thevetted.com",
          name: "Sai"
        },
        {
          id: 5,
          email: "brenkerts@dnb.com",
          name: "ram"
        }
      ]
    });
  });
  console.log("resget", res);

  try {
    dispatch({ type: GET_STEP_USERS_SUCCESS, payload: res.payload, stepId });
  } catch (err) {
    dispatch({ type: GET_STEP_USERS_FAILURE, payload: err, stepId });
  }
};

const deleteStepUser = (stepId, id) => async dispatch => {
  dispatch({ type: DELETE_STEP_USER_LOADING, stepId: stepId });

  //   const res = await axios.delete(`${baseUrl}/api/v1/step-user-tags/${id}`, {
  //     credentials: "include",
  //     header: {
  //       headers: authHeader.get()
  //     }
  //   });

  const res = await new Promise(function(resolve, reject) {
    resolve("success");
  });
  // console.log("resget", res);

  try {
    dispatch({ type: DELETE_STEP_USER_SUCCESS, stepId });
  } catch (err) {
    dispatch({ type: DELETE_STEP_USER_FAILURE, payload: err, stepId });
  }
};

const getAssignedUser = stepId => async dispatch => {
  dispatch({ type: POST_STEP_USER_LOADING, stepId: stepId });

  //   const res = await axios.delete(`${baseUrl}/api/v1/step-user-tags/?step=${stepId}`, {
  //     credentials: "include",
  //     header: {
  //       headers: authHeader.get()
  //     }
  //   });

  const res = await new Promise(function(resolve, reject) {
    resolve({
      payload: {
        count: 1,
        next: null,
        previous: null,
        results: []
      }
    });
  });
  // console.log("resget", res);

  try {
    if (res.payload.results.length) {
      dispatch({
        type: POST_STEP_USER_SUCCESS,
        payload: res.payload.results[0],
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
