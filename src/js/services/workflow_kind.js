import { authHeader, baseUrl, handleResponse } from "../_helpers";

export const workflowKindService = {
  getAll,
  getCount,
  getAlertCount,
  getStatusCount
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



function getAlertCount(tag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    baseUrl + "workflow-kinds/" + tag + "/alert-count",
    requestOptions
  ).then(handleResponse);
}

function getCount(tag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    baseUrl + "workflow-kinds/" + tag + "/count/?type=stepgroup",
    requestOptions
  ).then(handleResponse);
}

function getStatusCount(tag) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    baseUrl + "workflow-kinds/" + tag + "/count/?type=status",
    requestOptions
  ).then(handleResponse);
}

// function handleResponse(response) {
//   if (!response.ok) {
//     return Promise.reject(response.statusText);
//   }
//   let l = response.json();
//   console.log("l lag gaye ahai ahai ");
//   console.log(l);
//   return l;
// }
