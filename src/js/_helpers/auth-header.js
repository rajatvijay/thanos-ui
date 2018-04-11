import { getValueFromCookie } from "../utils/request";

// let domain = window.location.hostname;
// domain = domain.split(".");
// let client = domain[0];


export function authHeader() {
  return {
    "Content-Type": "application/json",
    "X-DTS-SCHEMA": "vetted"
    //"X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
  };
}

export function authHeaderCsrf() {
  return {
    "Content-Type": "application/json",
    "X-DTS-SCHEMA": "vetted",
    "X-CSRFToken": getValueFromCookie("csrftoken")
    //"X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
  };
}
