import { authHeader, baseUrl } from "../_helpers";
import _ from "lodash";
import { store } from "../_helpers";

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
      addComment: payload.addComment || ""
    })
  };

  let url =
    baseUrl + "workflows/" + payload.workflowId + "/change-status/?format=json";
  return fetch(url, requestOptions).then(handleResponse);
}

//COMMON FUNCTION TO HANDLE FETCH RESPONSE AND RETURN THE DATA TO FUNCTION AS PROMISED
function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
