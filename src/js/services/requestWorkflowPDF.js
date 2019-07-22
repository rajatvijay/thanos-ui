import { authHeader } from "../_helpers";
import { apiBaseURL } from "../../config";

// /workflow/pdf-print/

const END_POINT = "workflow/pdf-print/";

const getURL = () => {
  return `${apiBaseURL}${END_POINT}`;
};

function requestWorflowPDF(payload) {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify(payload)
  };

  const url = getURL();
  return fetch(url, requestOptions).then(response => {
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    return response;
  });
}

export { requestWorflowPDF };
