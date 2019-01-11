import { authHeader, baseUrl } from "../_helpers";
import _ from "lodash";
import { store } from "../_helpers";

function updateSelectedLanguage(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ to_language: payload })
  };

  let url = baseUrl + "users/change_prefered_language/";
  return fetch(url, requestOptions).then(handleResponse);
}

//COMMON FUNCTION TO HANDLE FETCH RESPONSE AND RETURN THE DATA TO FUNCTION AS PROMISED
function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}

export const updateSelectedLanguageService = {
  updateSelectedLanguage
};
