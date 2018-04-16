import { authHeader, handleResponse } from "../_helpers";

export const workflowKindService = {
  getAll
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    "http://slackcart.com/api/v1/workflow-kinds/",
    requestOptions
  ).then(handleResponse);
}

// function handleResponse(response) {
//   if (!response.ok) {
//     return Promise.reject(response.statusText);
//   }

//   return response.json();
// }
