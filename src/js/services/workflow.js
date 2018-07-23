import { authHeader, baseUrl } from "../_helpers";
import _ from "lodash";
import { store } from "../_helpers";

export const workflowService = {
  getAll,
  getById,
  searchWorkflow
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
    url = baseUrl + "workflows/";

  url += filterParams;

  if (filter) {
    const params = pageUrl(filter);
    url += params;
  }
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

  return fetch(baseUrl + "workflows/" + id + "/", requestOptions).then(
    handleResponse
  );
}

function searchWorkflow(query) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  let url = baseUrl + "workflows/?q=" + query;

  return fetch(url, requestOptions).then(handleResponse);
}

//COMMON FUNCTION TO HANDLE FETCH RESPONSE AND RETURN THE DATA TO FUNCTION AS PROMISED
function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
