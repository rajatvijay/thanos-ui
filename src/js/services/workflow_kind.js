import { authHeader, baseUrl } from "../_helpers";

export const workflowKindService = {
  getAll,
  getCount
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(baseUrl + "workflow-kinds/", requestOptions).then(
    handleResponse
  );
}

function getCount(tag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    baseUrl + "workflow-kinds/" + tag + "/count/",
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  let l = response.json();
  console.log("l lag gaye ahai ahai ");
  console.log(l);
  return l;
}
