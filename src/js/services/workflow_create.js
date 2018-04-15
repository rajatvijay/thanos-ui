import { authHeader,handleResponse } from "../_helpers";
import { getValueFromCookie } from "../utils/request";

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

  return fetch("http://slackcart.com/api/v1/workflows/", requestOptions).then(
    handleResponse
  );
}

// function handleResponse(response) {
//   if (!response.ok) {
//     return Promise.reject(response.statusText);
//   }
//   return response.json();
// }
