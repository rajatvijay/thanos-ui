const getSite = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");

  //prod
  // let domain =
  //   document.location.protocol +
  //   "//api." +
  //   hostSplit[1] +
  //   "." +
  //   hostSplit[2] +
  //   "/api/v1/";
  // return domain;

  //local
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
  //let domain = document.location.protocol + "//" + host + "/api/v1/";  //props
  let domain = document.location.protocol + "//" + host + ":8000/api/v1/"; //local
  return domain;
};

//common
export const baseUrl = getSite();
export const baseUrl2 = subDomainUrl();

//local with prod data
// export const baseUrl = "https://api.slackcart.com/api/v1/";
// export const baseUrl2 = "https://walmart.slackcart.com/api/v1/";
