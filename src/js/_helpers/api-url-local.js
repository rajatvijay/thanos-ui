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

export const baseUrl = getSite();
