import { authHeader } from "../_helpers";

export const workflowDetailsService = {
  getById,
  update,
  delete: _delete
};

//Get client name for form headers.
let domain = window.location.hostname;
domain = domain.split(".");
let client = domain[0];

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch("/api/workflow/" + id, requestOptions).then(handleResponse);
}

function update(workflow) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
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
    headers: authHeader()
  };

  return fetch("/api/workflow/" + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
