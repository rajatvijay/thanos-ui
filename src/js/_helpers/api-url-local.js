const getSite = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain =
    document.location.protocol +
    "//" +
    hostSplit[0] +
    "." +
    hostSplit[1] +
    "." +
    hostSplit[2] +
    ":8000/api/v1/";
  return domain;
};

const subDomainUrl = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain = document.location.protocol + "//" + host + "/api/v1/";
  return domain;
};

// export const baseUrl = getSite();

// export const baseUrl2 = subDomainUrl();


export const baseUrl = getSite();

export const baseUrl2 = subDomainUrl();
