import { authHeader } from "../_helpers";
import { apiBaseURL } from "../../config";

const handleResponse = (response, hasNONJSONResponse) => {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  if (hasNONJSONResponse) {
    return null;
  }
  return response.json();
};

export const stepBodyService = {
  postStepUser,
  getStepUsers,
  deleteStepUser,
  getAssignedUser,
  getMyTasksCount
};

function postStepUser(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return fetch(`${apiBaseURL}step-user-tags/`, requestOptions).then(
    handleResponse
  );
}

function getStepUsers(stepId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    `${apiBaseURL}steps/${stepId}/get-users-with-edit-access/`,
    requestOptions
  ).then(handleResponse);
}

function deleteStepUser(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader.post(),
    credentials: "include"
  };

  return fetch(`${apiBaseURL}step-user-tags/${id}/`, requestOptions).then(res =>
    handleResponse(res, true)
  );
}

function getAssignedUser(stepId) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    `${apiBaseURL}step-user-tags/?step=${stepId}`,
    requestOptions
  ).then(handleResponse);
}

function getMyTasksCount() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  return fetch(
    `${apiBaseURL}get-my-tagged-incomplete-steps/`,
    requestOptions
  ).then(handleResponse);
}
