import { authHeader, handleResponse } from "../_helpers";
import _ from "lodash";
import { store } from "../_helpers";
import { APIFetch } from "../utils/request";

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

  const filters = store.getState().workflowFilters;
  const filterParams = getFilterParams(filters);
  let url = `workflows-list/${filterParams}&lean=true`;

  if (filter) {
    const params = pageUrl(filter);
    url += params;
  }

  // This is super a bad hack
  // But a quick win over doing a lot of minor fixes and refactoring
  // Doing this specifically for VET-5267
  // Not send ant other filter in case of my task
  // In case of confusion, please contact rajat@thevetted.com
  if (url.includes("user-step-tag")) {
    const searchString = url.split("?")[1];
    const searchParams = new URLSearchParams(searchString);
    searchParams.delete("kind");
    url = `workflows-list/?${searchParams.toString()}`;
  }

  return APIFetch(url, requestOptions).then(handleResponse);
}

function clearAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  const filters = store.getState().workflowFilters;
  const filterParams = getFilterParams(filters);
  const url = `workflows-list/${filterParams}&lean=true`;

  return APIFetch(url, requestOptions).then(handleResponse);
}

//GET CHILD WORKFLOW
function getChildWorkflow(parent) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  const url = `workflows-list/?parent_workflow_id=${parent}`;
  return APIFetch(url, requestOptions).then(handleResponse);
}

//CONSTRUCT PARAM FOR FILTERS
const getFilterParams = filters => {
  let p = "?";
  _.map(filters, function(i, index) {
    const isFirst = index === 0 ? true : false;

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
  const url = _.map(filter, function(i, index) {
    let g = "";
    g = g + "&" + i.label + "=" + i.value;
    return g;
  });
  return url.join("");
};

//GET WORKFLOW BY ID
function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(`workflows/${id}/`, requestOptions).then(handleResponse);
}

function searchWorkflow(query, page) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ q: query })
  };
  const url = `workflows-list/search/?page=${page}`;

  return APIFetch(url, requestOptions).then(handleResponse);
}

function searchUserWorkflowByEmail({ email }) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ email: email })
  };

  return APIFetch(`workflows/search-user-workflow/`, requestOptions).then(
    handleResponse
  );
}

function updateWorkflow({ id, payload }) {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  return APIFetch(`workflows/${id}/`, requestOptions).then(handleResponse);
}
