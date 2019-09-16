import { authHeader, handleResponse } from "../_helpers";
import { apiBaseURL } from "../../config";

function updateSelectedLanguage(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ to_language: payload })
  };

  const url = apiBaseURL + "users/change_prefered_language/";
  return fetch(url, requestOptions).then(handleResponse);
}

export const updateSelectedLanguageService = {
  updateSelectedLanguage
};
