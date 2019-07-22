import { authHeader, handleResponse } from "../_helpers";
import { apiBaseURL } from "../../config";

export const stepPreviewService = { getStepPreviewFields };

function getStepPreviewFields(step) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    //UNCOMMENT BELOW TO GET REAL DATA FOR WORKFLOW AND REMOVE SECOND LINE.
    apiBaseURL +
      "workflows/" +
      step.workflowId +
      "/stepgroups/" +
      step.groupId +
      "/steps/" +
      step.stepId +
      "/",
    requestOptions
  ).then(handleResponse);
}
