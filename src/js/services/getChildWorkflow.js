import { authHeader, baseUrl } from "../_helpers";

const getURL = (parentId, kind, limit = 100) => {
  const sanitizedParamsObject = JSON.parse(
    JSON.stringify({ parentId, kind, limit })
  );
  const params = new URLSearchParams(sanitizedParamsObject);
  return `${baseUrl}workflows-list/?${params}`;
};

function getChildWorkflow(parentId, kind) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  const url = getURL(parentId, kind);
  return fetch(url, requestOptions).then(response => {
    // console.log(response.json());
    return response.json();
  });
}

export { getChildWorkflow };
