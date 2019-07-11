import { authHeader, handleResponse, baseUrl } from "../_helpers";

export const stepBodyService = {
  postStepUser,
  getStepUsers,
  deleteStepUser,
  getAssignedUser
};

function postStepUser(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return fetch(`${baseUrl}step-user-tags/`, requestOptions).then(
    handleResponse
  );
}

function getStepUsers(stepId) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    `${baseUrl}steps/${stepId}/get-users-with-edit-access/`,
    requestOptions
  ).then(handleResponse);
}

function deleteStepUser(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader.post(),
    credentials: "include"
  };

  return fetch(`${baseUrl}step-user-tags/${id}/`, requestOptions).then(
    handleResponse
  );
}

function getAssignedUser(stepId) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(`${baseUrl}step-user-tags/?step=${stepId}`, requestOptions).then(
    handleResponse
  );
}
