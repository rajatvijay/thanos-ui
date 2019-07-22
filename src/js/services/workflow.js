import { authHeader } from "../_helpers";
import _ from "lodash";
import { store } from "../_helpers";
import { apiBaseURL } from "../../config";

export const workflowService = {
  getAll,
  getById,
  searchWorkflow,
  getChildWorkflow,
  searchUserWorkflowByEmail,
  updateWorkflow,
  clearAll
};

//FETCH THE LIST OF WORLFOWS FOR WORKFLOW LIST PAGE
function getAll(filter) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  //case filter type status ==> http://slackcart.com/api/v1/workflows/?status=<status_id>
  //case filter type kind ==>   http://slackcart.com/api/v1/workflows/?kind=<kind_id>
  //case filter type multi ==>  http://slackcart.com/api/v1/workflows/?answer=<field_tag>__<operator>__<value>
  //case filter type multi ==>  http://slackcart.com/api/v1/workflows/?stepgroupdef=<stepgroup_id>

  let filters = store.getState().workflowFilters,
    filterParams = getFilterParams(filters),
    url = apiBaseURL + "workflows-list/";

  url += filterParams + "&lean=true";

  if (filter) {
    const params = pageUrl(filter);
    url += params;
  }
  return fetch(url, requestOptions).then(handleResponse);
}

function clearAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let filters = store.getState().workflowFilters,
    filterParams = getFilterParams(filters),
    url = apiBaseURL + "workflows-list/";

  url += filterParams + "&lean=true";

  return fetch(url, requestOptions).then(handleResponse);
}

//GET CHILD WORKFLOW
function getChildWorkflow(parent) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let url = apiBaseURL + "workflows-list/?parent_workflow_id=" + parent;

  return fetch(url, requestOptions).then(handleResponse);
}

//CONSTRUCT PARAM FOR FILTERS
const getFilterParams = filters => {
  let p = "?";
  _.map(filters, function(i, index) {
    let isFirst = index === 0 ? true : false;

    if (i) {
      _.map(i.filterValue, function(val) {
        if (isFirst) {
          p = p + "?" + i.filterType + "=" + val;
        } else {
          p = p + "&" + i.filterType + "=" + val;
        }
      });
    }
  });
  return p;
};

//CONSTRUCT PARAM FOR PAGINATION
const pageUrl = filter => {
  let url = _.map(filter, function(i, index) {
    let g = "";
    g = g + "&" + i.label + "=" + i.value;
    // if (index === 0) {
    //   g = g + "?" + i.label + "=" + i.value;
    // } else {
    // }
    return g;
  });
  return url.toString();
};

//GET WORKFLOW BY ID
function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(apiBaseURL + "workflows/" + id + "/", requestOptions).then(
    handleResponse
  );
}

function searchWorkflowGet(query) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let url = apiBaseURL + "workflows/?q=" + query;

  return fetch(url, requestOptions).then(handleResponse);
}

function searchWorkflow(query) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ q: query })
  };

  let url = apiBaseURL + "workflows-list/search/";

  return fetch(url, requestOptions).then(handleResponse);
}

function searchUserWorkflowByEmail({ email }) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ email: email })
  };

  return fetch(
    `${apiBaseURL}workflows/search-user-workflow/`,
    requestOptions
  ).then(handleResponse);
}

function updateWorkflow({ id, payload }) {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return fetch(`${apiBaseURL}workflows/${id}/`, requestOptions).then(
    handleResponse
  );
}

// COMMON FUNCTION TO HANDLE FETCH RESPONSE AND RETURN THE DATA TO FUNCTION AS PROMISED
function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
