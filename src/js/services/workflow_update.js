import { authHeader } from "../_helpers";
import { getValueFromCookie } from "../utils/request";

export const workflowFieldService = {
  saveField,
  updateField
};

function saveField(payload) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return fetch("http://slackcart.com/api/v1/responses/", requestOptions).then(
    handleResponse
  );
}

function updateField(payload) {
  const requestOptions = {
    method: "PATCH",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ answer: payload.answer })
  };

  return fetch(
    "http://slackcart.com/api/v1/responses/" + payload.answerId + "/",
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}
