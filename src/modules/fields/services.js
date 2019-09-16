import { authHeader, handleResponse } from "../../js/_helpers";
import { APIFetch } from "../../js/utils/request";
import { requiredParam } from "../common/errors";

function saveResponse({
  answer = requiredParam("answer"),
  field = requiredParam("field"),
  workflow = requiredParam("workflow"),
  extra_json
}) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader.post(),
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(arguments[0])
  };

  return APIFetch("responses/", requestOptions).then(handleResponse);
}

function clearResponse({ responseId = requiredParam("responseId"), payload }) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader.post(),
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  if (payload) {
    requestOptions.body = payload;
  }

  return APIFetch(`responses/${responseId}/clear/`, requestOptions).then(
    handleResponse
  );
}

export const fieldService = {
  saveResponse,
  clearResponse
};
