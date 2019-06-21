const DEFAULT_TENANT = "fb";
const DEFAULT_BASE_URL = "https://api.slackcart.com/api/v1/";

function getAPIBaseURL() {
  const url = new URL(window.location.href);
  const { hostname, protocol } = url;
  const host = hostname.split(".");
  return protocol + "//api." + host[1] + "." + host[2] + "/api/v1/";
}

function getTenant() {
  const url = new URL(window.location.href);
  return url.hostname.split(".")[0];
}

function isProductionEnv() {
  return process.env.NODE_ENV === "production" ? true : false;
}

export const baseUrl = isProductionEnv() ? getAPIBaseURL() : DEFAULT_BASE_URL;
export const tenant = isProductionEnv() ? getTenant() : DEFAULT_TENANT;
