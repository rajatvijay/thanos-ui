const url = new URL(window.location.href);

function getAPIBaseURL() {
  const { hostname, protocol } = url;

  const host = hostname.split(".");

  return protocol + "//api." + host[1] + "." + host[2] + "/api/v1/";
}

function getTenant() {
  const { hostname } = url;
  return hostname.split(".")[0];
}

const DEFAULT_TENANT = "walmart";
const DEFAULT_BASE_URL = "https://api.slackcart.com/api/v1/";

function isProductionEnv() {
  return process.env.NODE_ENV === "production" ? true : false;
}

export const baseUrl = isProductionEnv() ? getAPIBaseURL() : DEFAULT_BASE_URL;

export const tenant = isProductionEnv() ? getAPIBaseURL() : DEFAULT_TENANT;
