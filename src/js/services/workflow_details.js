import { authHeader, baseUrl, handleResponse } from "../_helpers";

export const workflowDetailsService = {
  getById,
  getStepGroup,
  getStepFields,
  getComments
};

//GET WORKFLOW BY ID
function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  console.log(baseUrl + "workflows/" + id + "/");
  return fetch(baseUrl + "workflows/" + id + "/", requestOptions).then(
    handleResponse
  );
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

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    //baseUrl + "workflows/" + id + "/stepgroups/",
    baseUrl +
      "channels?object_id=" +
      payload.object_id +
      "&type=" +
      payload.type,
    requestOptions
  ).then(handleResponse);
}
