import { getValueFromCookie } from "../utils/request";

// let domain = window.location.hostname;
// domain = domain.split(".");
// let client = domain[0];

export const authHeader = {
  get,
  post,
  requestOptions
};

function get() {
  return {
    "Content-Type": "application/json",
    "X-DTS-SCHEMA": "vetted"
    //"X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
  };
}

function post() {
  return {
    "Content-Type": "application/json",
    "X-DTS-SCHEMA": "vetted",
    "X-CSRFToken": getValueFromCookie("csrftoken")
    //"X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
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
