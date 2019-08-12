export const fetchWorkflowDetails = stepTag => {
  return fetch(
    `https://af3e2827-dd97-40a5-bb17-befe64b64f54.mock.pstmn.io/api/v1/workflow/pdf/config/2133/?trigger_step=${stepTag}`
  ).then(response => response.json());
};

export const submitWorkflows = requestOptions => {
  return fetch(
    "https://af3e2827-dd97-40a5-bb17-befe64b64f54.mock.pstmn.io/api/v1/workflow/pdf/print/",
    requestOptions
  ).then(response => {
    return response;
  });
};
