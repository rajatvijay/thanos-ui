import { authHeader } from "../_helpers";
import { apiBaseURL } from "../../config";

export const workflowStepService = {
  saveField,
  updateField,
  fetchFieldExtra,
  submitStep,
  approveStep,
  undoStep,
  addComment,
  updateFlag,
  updateIntegrationStatus,
  removeAttachment
};

function saveField(payload) {
  let requestOptions = {};
  if (payload.attachment) {
    const data = new FormData();
    data.append("workflow", payload.workflow);
    data.append("field", payload.field);
    data.append("attachment", payload.attachment);

    requestOptions = {
      method: "POST",
      headers: {
        ...authHeader.post()
      },
      credentials: "include",
      body: data
    };

    delete requestOptions.headers["Content-Type"];
  } else {
    requestOptions = {
      method: "POST",
      headers: {
        ...authHeader.post(),
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    };
  }

  return fetch(apiBaseURL + "responses/", requestOptions).then(handleResponse);
}

function removeAttachment({ workflow, field, responseId }) {
  let requestOptions = {};

  const data = { attachment: null, workflow, field };

  requestOptions = {
    method: "PATCH",
    headers: { ...authHeader.post() },
    credentials: "include",
    body: JSON.stringify(data)
  };

  return fetch(
    apiBaseURL + "responses/" + responseId + "/",
    requestOptions
  ).then(handleResponse);
}

//update fields onchange
function updateField(payload) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      ...authHeader.post(),
      "Content-Type": payload.attachment
        ? "multipart/form-data"
        : "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ answer: payload.answer })
  };

  return fetch(
    apiBaseURL + "responses/" + payload.answerId + "/",
    requestOptions
  ).then(handleResponse);
}

//fetch extra for field
function fetchFieldExtra(field, answerFunction) {
  let url = field.definition.extra.api_url;
  if (!url) {
    return Promise.reject('"url" not defined for fetchFieldExtra');
  }
  const requestOptions = {
    method: "GET"
  };
  url = url.replace(
    /{([^}]*)}/g,
    (expr, variable) => answerFunction(variable) || ""
  );
  if (!url.match(/^https?:\/\//)) {
    url = apiBaseURL + url;
    Object.assign(requestOptions, {
      headers: authHeader.get(),
      credentials: "include"
    });
  }
  return fetch(url, requestOptions).then(handleResponse);
}

//Save step data on submit
function submitStep(payload) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include"
  };

  const url =
    apiBaseURL +
    "workflows/" +
    payload.workflow +
    "/stepgroups/" +
    payload.step_group +
    "/steps/" +
    payload.id +
    "/submit/";

  return fetch(url, requestOptions).then(handleResponse);
}

function approveStep(payload) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include"
  };

  const url =
    apiBaseURL +
    "workflows/" +
    payload.workflow +
    "/stepgroups/" +
    payload.step_group +
    "/steps/" +
    payload.id +
    "/approve/";

  return fetch(url, requestOptions).then(handleResponse);
}

function undoStep(payload) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include"
  };

  const url =
    apiBaseURL +
    "workflows/" +
    payload.workflow +
    "/stepgroups/" +
    payload.step_group +
    "/steps/" +
    payload.id +
    "/undo/";

  return fetch(url, requestOptions).then(handleResponse);
}

function addComment(payload) {
  let requestOptions = {};
  let data = payload;
  if (payload.attachment) {
    data = new FormData();
    data.append("object_id", payload.object_id);
    data.append("type", payload.type);
    data.append("message", payload.message);
    data.append("attachment", payload.attachment);
  } else {
    data = JSON.stringify(payload);
  }

  requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include",
    body: data
  };
  if (payload.attachment) {
    delete requestOptions.headers["Content-Type"];
  }

  return fetch(apiBaseURL + "channels/addmessage/", requestOptions).then(
    handleResponse
  );
}

function updateFlag(payload) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  };
  return fetch(apiBaseURL + "flags/", requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return response.json().then(error => {
      return Promise.reject(error);
    });
  }

  return response.json();
}

function updateIntegrationStatus(payload) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  };
  return fetch(
    apiBaseURL + "integrations/status-update/" + payload["row_uid"] + "/",
    requestOptions
  ).then(handleResponse);
}
