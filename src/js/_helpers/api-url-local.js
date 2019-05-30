export { baseUrl } from "../../config.js";

const subDomainUrl = site => {
  let host = document.location.hostname;
  let hostSplit = host.split(".");
  let domain = document.location.protocol + "//" + host + "/api/v1/"; //props
  return domain;
};

//export const baseUrl = "https://api.slackcart.com/api/v1/";

export const baseUrl2 = subDomainUrl();
