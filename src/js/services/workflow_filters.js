import { authHeader, handleResponse } from "../_helpers";
import { apiBaseURL } from "../../config";

export const workflowFiltersService = {
  // getFilters,
  setFilters,
  // removeFilters,

  // getKindData,
  getStatusData,
  getBusinessData,
  getRegionData
};

function getStatusData(queryParams = {}) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  const searchParams = new URLSearchParams(queryParams);
  const url = `${apiBaseURL}workflow-status/?${searchParams}`;

  return fetch(url, requestOptions).then(handleResponse);
}

function getBusinessData(region) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  const url = region
    ? apiBaseURL + `business-unit/extra-data/?regions__code=${region}`
    : apiBaseURL + "fields/export-business-json/";

  return fetch(url, requestOptions).then(handleResponse);
}

function getRegionData() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  const url = apiBaseURL + "fields/export-region-json/";

  return fetch(url, requestOptions)
    .then(handleResponse)
    .then(response => {
      const sortedResults = response.results.sort((a, b) =>
        a.label > b.label ? 1 : -1
      );
      return { results: sortedResults };
    });
}

function setFilters(payload) {}
