import { authHeader, handleResponse } from "../_helpers";
import { APIFetch } from "../utils/request";

export const workflowCreateService = {
  createWorkflow
};

function createWorkflow(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return APIFetch("workflows/", requestOptions).then(handleResponse);
}
