import { authHeader, baseUrl } from "../_helpers";

const getURL = (parentId, kind, limit = 100) =>
  `${baseUrl}workflows-list/?limit=${limit}&parent_workflow_id=${
    parentId
  }&kind=${kind}`;

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
