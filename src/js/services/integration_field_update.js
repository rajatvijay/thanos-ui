import { authHeader } from "../_helpers";
import { apiBaseURL } from "../../config";

export const dunsFieldService = {
  saveDunsField,
  selectDunsItem
};

function saveDunsField(payload) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let url = apiBaseURL + "integrations/?field_id=" + payload.fieldId;

  return fetch(url, requestOptions).then(handleResponse);
}

function selectDunsItem(payload) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...authHeader.post(),
      "Content-Type": payload.attachment
        ? "multipart/form-data"
        : "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  };

  let url = apiBaseURL + "integrations/dnb/";

  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return response.json();
  }
  return response.json();
}
