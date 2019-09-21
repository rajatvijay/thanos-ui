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

export function getMyTasksCount$$() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  return APIFetch(`get-my-tagged-incomplete-steps/`, requestOptions).then(
    handleResponse
  );
}

export function getWorkflowList$$(params = {}) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  //case filter type status ==> http://slackcart.com/api/v1/workflows/?status=<status_id>
  //case filter type kind ==>   http://slackcart.com/api/v1/workflows/?kind=<kind_id>
  //case filter type multi ==>  http://slackcart.com/api/v1/workflows/?answer=<field_tag>__<operator>__<value>
  //case filter type multi ==>  http://slackcart.com/api/v1/workflows/?stepgroupdef=<stepgroup_id>

  // const filters = store.getState().workflowFilters;
  // const filterParams = getFilterParams(filters);
  const queryParams = new URLSearchParams({
    ...params,
    lean: true
  });
  const url = `workflows-list/?${queryParams}`;

  // if (filter) {
  //   const params = pageUrl(filter);
  //   url += params;
  // }

  // This is super a bad hack
  // But a quick win over doing a lot of minor fixes and refactoring
  // Doing this specifically for VET-5267
  // Description: Remove the kind filter in case of my task
  // In case of any questions, please contact rajat@thevetted.com
  // if (url.includes("user-step-tag")) {
  //   const searchString = url.split("?")[1];
  //   const searchParams = new URLSearchParams(searchString);
  //   searchParams.delete("kind");
  //   url = `workflows-list/?${searchParams.toString()}`;
  // }

  return APIFetch(url, requestOptions).then(handleResponse);
}
