import { authHeader, baseUrl } from "../_helpers";

export const dunsFieldService = {
  saveDunsField
};

function saveDunsField(payload) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let url =
    "integrations/dnb/?field_id=" +
    payload.fieldId +
    "&" +
    payload.option1Tag +
    "=" +
    payload.option1Value +
    "&" +
    payload.option2Tag +
    "=" +
    payload.option2Value;

  console.log("url----------");
  console.log(url);

  return fetch(baseUrl + url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return response.json();
  }
  return response.json();
}
