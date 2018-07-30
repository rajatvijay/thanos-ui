import { authHeader, baseUrl, handleResponse } from "../_helpers";

export const workflowFiltersService = {
  // getFilters,
  setFilters,
  // removeFilters,

  // getKindData,
  getStatusData,
  getBusinessData
};

function getStatusData() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  let url = baseUrl + "workflow-status/";

  return fetch(url, requestOptions).then(handleResponse);
}

function getBusinessData() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  let url = baseUrl + "fields/export-business-json/";

  return fetch(url, requestOptions).then(handleResponse);
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
