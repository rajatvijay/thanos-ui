const getSite = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain =
    document.location.protocol +
    "//" +
    hostSplit[1] +
    "." +
    hostSplit[2] +
    "/api/v1/";
  return domain;
};

const subDomainUrl = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain = document.location.protocol + "//" + host + "/api/v1/";
  return domain;
};

export const baseUrl = "http://vetted.local:3000/api/v1/"; //getSite();

export const baseUrl2 = "http://vetted.local:3000/api/v1/"; //subDomainUrl();
