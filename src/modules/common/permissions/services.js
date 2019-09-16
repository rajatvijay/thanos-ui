import { authHeader, handleResponse } from "../../../js/_helpers";
import { APIFetch } from "../../../js/utils/request";

function getPermissions() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(`users/permissions/`, requestOptions).then(handleResponse);
}

export const permissionService = {
  getPermissions
};
