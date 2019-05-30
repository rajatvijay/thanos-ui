import { getValueFromCookie } from "../utils/request";
import { tenant } from "../../config";

export const authHeader = {
  get,
  post,
  requestOptions,
  getClient
};

function get() {
  let client = getClient();
  return {
    //"Content-Type": "application/json",
    "X-DTS-SCHEMA": client
  };
}

function post() {
  let client = getClient();
  return {
    "Content-Type": "application/json",
    "X-CSRFToken": getValueFromCookie("csrftoken"),
    "X-DTS-SCHEMA": client
  };
}

function requestOptions(method) {
  return {
    method: method === "get" ? "GET" : "POST",
    headers: method === "get" ? get() : post(),
    credentials: "include",
    mode: "cors"
  };
}

function getClient() {
  return tenant;
}
