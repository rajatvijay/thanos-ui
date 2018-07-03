import { authHeader, handleResponse, baseUrl } from "../_helpers";

export const workflowCreateService = {
  crerateWorkflow
};

function crerateWorkflow(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return fetch(baseUrl + "workflows/", requestOptions).then(handleResponse);
}

// function handleResponse(response) {
//   if (!response.ok) {
//     return Promise.reject(response.statusText);
//   }
//   return response.json();
// }
