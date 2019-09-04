import { authHeader } from "../../../js/_helpers";
import { APIFetch } from "../../../js/utils/request";

function getPermissions() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(`users/permissions/`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}

export const permissionService = {
  getPermissions
};
