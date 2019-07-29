import { authHeader, handleResponse } from "../_helpers";
import { APIFetch } from "../utils/request";

export const workflowDetailsService = {
  getById,
  getStepGroup,
  getStepFields,
  getComments,
  getStepVersionFields,
  archiveWorkflow
};

//GET WORKFLOW BY ID
function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(`workflows/${id}/?lean=true`, requestOptions).then(
    handleResponse
  );
}

function getStepGroup(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(
    `workflows/${parseInt(id, 10)}/stepgroups/`,
    requestOptions
  ).then(handleResponse);
}

function getStepFields(step) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(
    `workflows/${step.workflowId}/stepgroups/${step.groupId}/steps/${
      step.stepId
    }/`,
    requestOptions
  ).then(handleResponse);
}

function getComments(payload) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let request_url = `channels?object_id=${payload.object_id}&type=${
    payload.type
  }`;
  if (payload.extra) {
    request_url += `&field_id=${payload.extra.field_id}&uid=${
      payload.extra.uid
    }`;
  }

  return APIFetch(request_url, requestOptions).then(handleResponse);
}

function getStepVersionFields(step) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  const queryParams = `version=${step.versionId}`;
  const url = `workflows/${step.workflowId}/stepgroups/${step.groupId}/steps/${
    step.stepId
  }/`;

  return APIFetch(`${url}?${queryParams}`, requestOptions).then(handleResponse);
}

function archiveWorkflow(workflowId) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include"
  };

  const deleteUrl = `workflows/${workflowId}/archive/`;
  return APIFetch(deleteUrl, requestOptions).then(response => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return Promise.success(response);
  });
}
