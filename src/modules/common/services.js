import { authHeader, handleResponse } from "../../js/_helpers";
import { APIFetch } from "../../js/utils/request";

export async function getStatusData(queryParams = {}) {
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

export async function getBusinessData(region) {
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

export function getRegionData() {
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
