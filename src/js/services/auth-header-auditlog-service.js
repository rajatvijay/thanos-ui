import { tenant } from "../../config";

function get() {
  return {
    "Content-Type": "application/json",
    "x-tenant": tenant
  };
}

export function requestOptions() {
  return {
    method: "GET",
    headers: get(),
    credentials: "include",
    mode: "cors"
  };
}
