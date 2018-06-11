import { authHeader, baseUrl } from "../_helpers";
import { getValueFromCookie } from "../utils/request";

export const workflowStepService = {
  saveField,
  updateField,
  submitStep,
  approveStep,
  undoStep
};

function saveField(payload) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader.post(),
      "Content-Type": payload.attachment
        ? "multipart/form-data"
        : "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return fetch(baseUrl + "responses/", requestOptions).then(handleResponse);
}

//update fields onchange
function updateField(payload) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      ...authHeader.post(),
      "Content-Type": payload.attachment
        ? "multipart/form-data"
        : "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ answer: payload.answer })
  };

  return fetch(
    baseUrl + "responses/" + payload.answerId + "/",
    requestOptions
  ).then(handleResponse);
}

//Save step data on submit
function submitStep(payload) {
  console.log(payload);

  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include"
    //body: JSON.stringify({ data: payload })
  };

  const url =
    baseUrl +
    "workflows/" +
    payload.workflow +
    "/stepgroups/" +
    payload.step_group +
    "/steps/" +
    payload.id +
    "/submit/";

  return fetch(url, requestOptions).then(handleResponse);
}

function approveStep(payload) {
  console.log(payload);

  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include"
    //body: JSON.stringify({ data: payload })
  };

  const url =
    baseUrl +
    "workflows/" +
    payload.workflow +
    "/stepgroups/" +
    payload.step_group +
    "/steps/" +
    payload.id +
    "/approve/";

  return fetch(url, requestOptions).then(handleResponse);
}

function undoStep(payload) {
  console.log(payload);

  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include"
  };

  const url =
    baseUrl +
    "workflows/" +
    payload.workflow +
    "/stepgroups/" +
    payload.step_group +
    "/steps/" +
    payload.id +
    "/undo/";

  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}
