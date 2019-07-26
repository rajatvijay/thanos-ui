import { getValueFromCookie } from "../utils/request";
import { tenant } from "../../config";

export const authHeader = {
  get,
  post,
  requestOptions,
  tenant
};

function get() {
  return {
    "X-DTS-SCHEMA": tenant
  };
}

function post() {
  return {
    "Content-Type": "application/json",
    "X-CSRFToken": getValueFromCookie("csrftoken"),
    "X-DTS-SCHEMA": tenant
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
