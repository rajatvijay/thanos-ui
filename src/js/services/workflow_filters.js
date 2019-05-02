import { authHeader, baseUrl, handleResponse } from "../_helpers";

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
  const url = `${baseUrl}workflow-status/?${searchParams}`;

  return fetch(url, requestOptions).then(handleResponse);
}

function getBusinessData(region) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  let url = region
    ? baseUrl + `business-unit/extra-data/?regions__code=${region}`
    : baseUrl + "fields/export-business-json/";

  return fetch(url, requestOptions).then(handleResponse);
}

function getRegionData() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  let url = baseUrl + "fields/export-region-json/";

  return fetch(url, requestOptions)
    .then(handleResponse)
    .then(response => {
      const sortedResults = response.results.sort(
        (a, b) => (a.label > b.label ? 1 : -1)
      );
      return { results: sortedResults };
    });
}

function setFilters(payload) {
  // const requestOptions = {
  //   method: "POST",
  //   headers: { ...authHeader.post(), "Content-Type": "application/json" },
  //   credentials: "include",
  //   body: JSON.stringify(payload)
  // };
  // return fetch(baseUrl + "responses/", requestOptions).then(handleResponse);
}
