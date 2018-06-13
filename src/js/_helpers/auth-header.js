import { getValueFromCookie } from "../utils/request";

export const authHeader = {
  get,
  post,
  requestOptions,
  getClient
};

function get() {
  let client = getClient();
  return {
    "Content-Type": "application/json",
    //"X-DTS-SCHEMA": "vetted"
    "X-DTS-SCHEMA": client !== "test" ? client : "vetted"
  };
}

function post() {
  let client = getClient();
  return {
    "Content-Type": "application/json",
    //"X-DTS-SCHEMA": "vetted",
    "X-CSRFToken": getValueFromCookie("csrftoken"),
    "X-DTS-SCHEMA": client !== "test" ? client : "vetted"
  };
}

function requestOptions(method) {
  return {
    method: method === "get" ? "GET" : "POST",
    headers: method === "get" ? get() : post(),
    credentials: "include",
    mode: "no-cors"
  };
}

function getClient() {
  let domain = window.location.hostname;
  domain = domain.split(".");
  let client = domain[0];

  return client;
}
