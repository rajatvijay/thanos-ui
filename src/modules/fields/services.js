import { authHeader } from "../../js/_helpers";
import { APIFetch } from "../../js/utils/request";

function saveResponse({ answer, fieldId, workflowId }) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader.post(),
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ answer, field: fieldId, workflow: workflowId })
  };

  return APIFetch("responses/", requestOptions).then(handleResponse);
}

function saveAttachment({ attachment, field, workflow }) {}

function clearResponse({ responseId, fieldId, workflowId }) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader.post(),
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  return APIFetch(`responses/${responseId}/clear/`, requestOptions).then(
    handleResponse
  );
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}

export const fieldService = {
  saveResponse,
  clearResponse
};
