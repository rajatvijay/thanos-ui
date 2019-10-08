import _ from "lodash";
import { userUtilities } from "./user";
import { apiBaseURL, auditLogBaseURL } from "../../config";

export const getValueFromCookie = name => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (const value of cookies) {
      const cookie = _.trim(value);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

/**
 * A very faithful fetch function that keeps the unauthorized users out
 * (warning - doesn't bite or bark, just keeps them out)
 * @param params
 * @returns {Promise<Response | never>}
 */
export const APIFetch = (...params) => {
  if (params[0].startsWith("http") || params[0].startsWith("/")) {
    throw new Error(
      "Invalid URL provided to APIFetch, must be a relative URL not starting with /"
    );
  }
  params[0] = `${apiBaseURL}${params[0]}`;
  return new Promise((resolve, reject) => {
    fetch(...params)
      .then(response => {
        if (response.status === 403 || response.status === 401) {
          if (params[0].indexOf("users/me") === -1) {
            // We dont want to get stuck in redicect loop if autologin
            // fails for any reason.
            userUtilities.postLogoutAction({ addNextURL: true });
          }
        }
        resolve(response);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

/**
 * A fetch function that keeps the unauthorized users out for serverless API calls
 * @param params
 * @returns {Promise<Response | never>}
 */
export const serverlessAPIFetch = (...params) => {
  if (params[0].startsWith("http") || params[0].startsWith("/")) {
    throw new Error(
      "Invalid URL provided to serverlessAPIFetch, must be a relative URL not starting with /"
    );
  }
  let baseUrl;
  if (params[2] === "AUDIT_LOG") {
    baseUrl = auditLogBaseURL;
  }

  params[0] = `${baseUrl}${params[0]}`;
  return fetch(...params).then(response => {
    if (response.status === 403 || response.status === 401) {
      userUtilities.postLogoutAction({ addNextURL: true });
    }
    return response;
  });
};
