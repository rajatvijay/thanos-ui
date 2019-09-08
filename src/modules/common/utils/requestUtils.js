import { userUtilities } from "../../../js/utils/user";
import { apiBaseURL } from "../../../config";

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
  return fetch(...params).then(response => {
    if (response.status === 403 || response.status === 401) {
      userUtilities.postLogoutAction({ addNextURL: true });
    }
    return response;
  });
};
