import { authHeader, baseUrl, handleResponse } from "../_helpers";

export const workflowDetailsService = {
  getById,
  getStepGroup,
  getStepFields,
  getComments,
  getStepVersionFields,
  archiveWorkflow
};

//GET WORKFLOW BY ID
function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    baseUrl + "workflows/" + id + "/?lean=true",
    requestOptions
  ).then(handleResponse);
}

function getStepGroup(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    //baseUrl + "workflows/" + id + "/stepgroups/",
    baseUrl + "workflows/" + parseInt(id, 10) + "/stepgroups/",
    requestOptions
  ).then(handleResponse);
}

function getStepFields(step) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    baseUrl +
      "workflows/" +
      step.workflowId +
      "/stepgroups/" +
      step.groupId +
      "/steps/" +
      step.stepId +
      "/",
    requestOptions
  ).then(handleResponse);
}

function getComments(payload) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let request_url =
    baseUrl +
    "channels?object_id=" +
    payload.object_id +
    "&type=" +
    payload.type;
  if (payload.extra) {
    request_url +=
      "&field_id=" + payload.extra.field_id + "&uid=" + payload.extra.uid;
  }

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    //baseUrl + "workflows/" + id + "/stepgroups/",
    request_url,
    requestOptions
  ).then(handleResponse);
}

function getStepVersionFields(step) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    baseUrl +
      "workflows/" +
      step.workflowId +
      "/stepgroups/" +
      step.groupId +
      "/steps/" +
      step.stepId +
      "/?version=" +
      step.versionId,
    requestOptions
  ).then(handleResponse);
}

function archiveWorkflow(workflowId) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.get(),
    credentials: "include"
  };

  const deleteUrl = `${baseUrl}/workflows/${workflowId}/archive/`;
  return fetch(deleteUrl, requestOptions).then(response => {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.text();
  });
}
