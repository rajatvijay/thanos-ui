import { authHeader, baseUrl } from "../_helpers";
import _ from "lodash";

export const workflowService = {
  getAll,
  getById
};

function getAll(filter) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  let params = "";
  let url = baseUrl + "workflows/";

  if (filter) {
    const params = filterUrl(filter);
    url += params;
  }

  return fetch(url, requestOptions).then(handleResponse);
}

const filterUrl = filter => {
  let url = _.map(filter, function(i, index) {
    let g = "";
    if (index === 0) {
      g = g + "?" + i.label + "=" + i.value;
    } else {
      g = g + "&" + i.label + "=" + i.values;
    }
    return g;
  });
  return url.toString();
};

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

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
