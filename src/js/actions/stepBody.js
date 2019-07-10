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

  // const res = await axios.post(`${baseUrl}step-user-tags`, obj, {
  //   credentials: "include",
  //   header: {
  //     headers: authHeader.get()
  //   }
  // });

  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ ...obj, tag: "Assignee" })
  };

  const url = `${baseUrl}step-user-tags/`;
  let res = await fetch(url, requestOptions);
  res = await res.json();

  // const res = await new Promise(function(resolve, reject) {
  //   resolve({
  //     payload: {
  //       id: 1, // this resource id
  //       tag: "responsible",
  //       step: 1,
  //       user: {
  //         name: "Rajat",
  //         email: "rajat@gmail.com"
  //       }
  //     }
  //   });
  // });
  // console.log("resget", res);

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
  dispatch({ type: GET_STEP_USERS_LOADING, stepId });

  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
    //body: JSON.stringify({ to_language: payload })
  };

  const url = `${baseUrl}steps/${stepId}/get-users-with-edit-access/`;
  let res = await fetch(url, requestOptions);
  res = await res.json();

  // const res = await axios.get(`${baseUrl}steps/322633/get-users-with-edit-access/`,{
  //         credentials: "include",
  //         headers: {
  //           headers: authHeader.get()
  //         }
  // });

  // const res = await new Promise(function(resolve, reject) {
  //   resolve({
  //     payload: [
  //       {
  //         id: 1,
  //         email: "sai@thevetted.com",
  //         name: "Sai"
  //       },
  //       {
  //         id: 5,
  //         email: "brenkerts@dnb.com",
  //         name: "ram"
  //       }
  //     ]
  //   });
  // });
  console.log("resget", res);

  try {
    dispatch({ type: GET_STEP_USERS_SUCCESS, payload: res, stepId });
  } catch (err) {
    dispatch({ type: GET_STEP_USERS_FAILURE, payload: err, stepId });
  }
};

const deleteStepUser = (stepId, id) => async dispatch => {
  dispatch({ type: DELETE_STEP_USER_LOADING, stepId: stepId });

  const requestOptions = {
    method: "DELETE",
    headers: authHeader.post(),
    credentials: "include"
    // body: JSON.stringify(obj)
  };

  const url = `${baseUrl}/api/v1/step-user-tags/${id}`;
  let res = await fetch(url, requestOptions);
  res = await res.json();

  //   const res = await axios.delete(`${baseUrl}/api/v1/step-user-tags/${id}`, {
  //     credentials: "include",
  //     header: {
  //       headers: authHeader.get()
  //     }
  //   });

  // const res = await new Promise(function(resolve, reject) {
  //   resolve("success");
  // });
  // console.log("resget", res);

  try {
    dispatch({ type: DELETE_STEP_USER_SUCCESS, stepId });
  } catch (err) {
    dispatch({ type: DELETE_STEP_USER_FAILURE, payload: err, stepId });
  }
};

const getAssignedUser = stepId => async dispatch => {
  dispatch({ type: POST_STEP_USER_LOADING, stepId: stepId });

  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
    //body: JSON.stringify({ to_language: payload })
  };

  const url = `${baseUrl}step-user-tags/?step=${stepId}`;
  let res = await fetch(url, requestOptions);
  res = await res.json();

  // const res = await axios.get(`${baseUrl}step-user-tags/?step=${stepId}`, {
  //   credentials: "include",
  //   header: {
  //     headers: authHeader.get(),"Content-Type":"application/json"
  //   }
  // });

  // const res = await new Promise(function(resolve, reject) {
  //   resolve({
  //     payload: {
  //       count: 1,
  //       next: null,
  //       previous: null,
  //       results: []
  //     }
  //   });
  // });
  console.log("resget", res);

  try {
    if (res.results.length) {
      dispatch({
        type: POST_STEP_USER_SUCCESS,
        payload: res.results[0],
        stepId: stepId
      });
    } else {
      console.log("getting");
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
