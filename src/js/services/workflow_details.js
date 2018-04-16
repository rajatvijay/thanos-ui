import { authHeader } from "../_helpers";
import { getValueFromCookie } from "../utils/request";

export const workflowDetailsService = {
  getById,
  getStepGroup,
  update,
  getStepFields,
  delete: _delete
};

//Get client name for form headers.
//let domain = window.location.hostname;
//domain = domain.split(".");
//let client = domain[0];

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get()
  };

  return fetch("/api/workflow/" + id, requestOptions).then(handleResponse);
}

function getStepGroup(id) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": "vetted"
    },
    credentials: "include"
  };

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    //"http://slackcart.com/api/v1/workflows/" + id + "/stepgroups/",
    "http://slackcart.com/api/v1/workflows/7/stepgroups/",
    requestOptions
  ).then(handleResponse);
}

function getStepFields(step) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": "vetted"
    },
    credentials: "include"
  };

  console.log("step/////////////////////////////////////////");
  console.log(step);

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    "http://slackcart.com/api/v1/workflows/" +
      step.workflowId +
      "/stepgroups/" +
      step.groupId +
      "/steps/" +
      step.stepId +
      "/",
    //"http://slackcart.com/api/v1/workflows/7/stepgroups/2/steps/2/",
    requestOptions
  ).then(handleResponse);
}

function update(workflow) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader.get(), "Content-Type": "application/json" },
    body: JSON.stringify(workflow)
  };

  return fetch("/api/workflow/" + workflow.id, requestOptions).then(
    handleResponse
  );
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader.get()
  };

  return fetch("/api/workflow/" + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
