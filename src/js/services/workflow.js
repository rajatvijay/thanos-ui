import { authHeader } from "../_helpers";

export const workflowService = {
  getAll,
  getById
};

//Get client name for form headers.
// let domain = window.location.hostname;
// domain = domain.split(".");
// let client = domain[0];

function getAll() {
  const requestOptions = {
    method: "GET",
    //headers: authHeader()
    headers: {
      "Content-Type": "application/json",
      //"X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
      "X-DTS-SCHEMA": "vetted"
    },
    credentials: "include"
  };

  // return fetch("http://thevetted.co/api/v1/users/", requestOptions).then(
  //   handleResponse
  // );
  return fetch("http://slackcart.com/api/v1/workflows/", requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch("/api/workflows/" + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
