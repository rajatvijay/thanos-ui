import { authHeader, baseUrl } from "../../js/_helpers";

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

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}

export const updateSelectedLanguageService = {
  updateSelectedLanguage
};
