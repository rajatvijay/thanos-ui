import { APIFetch } from "../utils/request";
import { authHeader } from "../_helpers";

export const fetchWorkflowDetails = (stepTag, stepId) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader.post(),
    credentials: "include"
  };
  return APIFetch(
    `workflow/pdf/config/${stepId}/?trigger_step=${stepTag}`,
    requestOptions
  ).then(response => response.json());
};

export const submitWorkflows = body => {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(body)
  };
  return APIFetch("workflow/pdf/print/", requestOptions).then(response => {
    return response;
  });
};
