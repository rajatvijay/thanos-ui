import { authHeader, handleResponse } from "../_helpers";
import { apiBaseURL } from "../../config";

export const workflowKindService = {
  getAll,
  getCount,
  getAlertCount
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(apiBaseURL + "workflow-kinds/?limit=50", requestOptions).then(
    handleResponse
  );
}

function getAlertCount(tag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    apiBaseURL + "workflow-kinds/" + tag + "/alert-count",
    requestOptions
  ).then(handleResponse);
}

function getCount(tag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    apiBaseURL + "workflow-kinds/" + tag + "/count/?type=stepgroup",
    requestOptions
  ).then(handleResponse);
}
