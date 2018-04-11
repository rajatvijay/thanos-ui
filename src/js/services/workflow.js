import { authHeader } from "../_helpers";

export const workflowService = {
  getAll,
  getById
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
    credentials: "include"
  };

  return fetch("http://slackcart.com/api/v1/workflows/", requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
    credentials: "include"
  };

  return fetch(
    "http://slackcart.com/api/v1/workflows/" + id + "/",
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
