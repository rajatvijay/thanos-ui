function getSite() {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain =
    document.location.protocol +
    "//api." +
    hostSplit[1] +
    "." +
    hostSplit[2] +
    "/api/v1/";
  return domain;
}

function getClient() {
  let domain = window.location.hostname;
  domain = domain.split(".");
  let client = domain[0];
  return client;
}

const baseUrl =
  process.env.NODE_ENV === "production"
    ? getSite()
    : "https://api.slackcart.com/api/v1/";

const client = process.env.NODE_ENV === "production" ? getClient() : "walmart";

export const env = baseUrl;
export const tenant = client;
