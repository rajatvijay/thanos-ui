import { authHeader } from "../../js/_helpers";
import { apiBaseURL } from "../../config";
import Godaam from "../../js/utils/storage";
import { APIFetch } from "../../js/utils/request";

export function updateSelectedLanguage(payload) {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({ to_language: payload })
    };

    const url = apiBaseURL + "users/change_prefered_language/";
    try {
      const response = await fetch(url, requestOptions).then(handleResponse);
      if (!!response.prefered_language) {
        // prefered_language was set successfully
        // so we're going to update user in our storage
        const user = JSON.parse(Godaam.user);
        user.prefered_language = response.prefered_language;
        Godaam.user = JSON.stringify(user);
      }
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
}

export const exportWorkflow = ({ kind }) => {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(`workflow-kinds/${kind}/data-export/`, requestOptions);
};

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
