import { authHeader, handleResponse } from "../../js/_helpers";
import { APIFetch } from "../../js/utils/request";

export async function getStatusesList$$(queryParams = {}) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  const searchParams = new URLSearchParams(queryParams);
  const url = `workflow-status/?${searchParams}`;

  const response = await APIFetch(url, requestOptions);
  return handleResponse(response);
}

export async function getBusinessUnitsList$$(region) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  const url = region
    ? `business-unit/extra-data/?regions__code=${region}`
    : "fields/export-business-json/";

  const response = await APIFetch(url, requestOptions);
  return handleResponse(response);
}

export function getRegionsList$$() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  const url = "fields/export-region-json/";

  return APIFetch(url, requestOptions)
    .then(handleResponse)
    .then(response => {
      const sortedResults = response.results.sort((a, b) =>
        a.label > b.label ? 1 : -1
      );
      return { results: sortedResults };
    });
}

export function getAllKinds$$() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch("workflow-kinds/?limit=50", requestOptions).then(
    handleResponse
  );
}

export function getAllAlerts$$(kindTag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(
    "workflow-kinds/" + kindTag + "/alert-count",
    requestOptions
  ).then(handleResponse);
}

export function getAllTaskQueues$$(kindTag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(
    "workflow-kinds/" + kindTag + "/count/?type=stepgroup",
    requestOptions
  ).then(handleResponse);
}
