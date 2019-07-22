import { authHeader } from "../_helpers";
import { apiBaseURL } from "../../config";

export const configService = {
  getConfig
};

function getConfig() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(apiBaseURL + "customers/configuration/", requestOptions).then(
    handleResponse
  );
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}
