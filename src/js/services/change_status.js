import { authHeader, handleResponse } from "../_helpers";
import { apiBaseURL } from "../../config";

export const changeStatusService = {
  update
};

//FETCH THE LIST OF WORLFOWS FOR WORKFLOW LIST PAGE
function update(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({
      status: payload.statusId,
      addComment: payload.addComment || "",
      integration_field_tag: payload.integration_field_tag || "",
      parent_workflow_id: payload.parent_workflow_id || ""
    })
  };

  const url =
    apiBaseURL +
    "workflows/" +
    payload.workflowId +
    "/change-status/?format=json";
  return fetch(url, requestOptions).then(handleResponse);
}
