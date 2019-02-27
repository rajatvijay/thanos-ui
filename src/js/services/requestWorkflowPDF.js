import { authHeader, baseUrl } from "../_helpers";

// /workflow/pdf-print/

const END_POINT = "workflow/pdf-print/";

const getURL = () => {
  return `${baseUrl}${END_POINT}`;
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
    console.log(response.json());
    return response.json();
  });
}

export { requestWorflowPDF };
