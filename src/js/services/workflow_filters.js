import { authHeader, handleResponse } from "../_helpers";
import { APIFetch } from "../utils/request";

export const workflowFiltersService = {
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
  const url = `workflow-status/?${searchParams}`;

  return APIFetch(url, requestOptions).then(handleResponse);
}

function getBusinessData(region) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  const url = region
    ? `business-unit/extra-data/?regions__code=${region}`
    : "fields/export-business-json/";

  return APIFetch(url, requestOptions).then(handleResponse);
}

function getRegionData() {
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
