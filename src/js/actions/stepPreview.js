import { stepPreviewConstants } from "../constants";
import { stepPreviewService } from "../services";
import _ from "lodash";

export const stepPreviewActions = { getStepPreviewFields };

function getStepPreviewFields(step) {
  return dispatch => {
    if (!step.doNotRefresh) {
      dispatch(request(step));
    }

    stepPreviewService
      .getStepPreviewFields(step)
      .then(
        stepFields => dispatch(success(stepFields)),
        error => dispatch(failure(error))
      );
  };

  function request(step) {
    return { type: stepPreviewConstants.PREVIEW_STEP_REQUEST, step };
  }
  function success(stepFields) {
    return {
      type: stepPreviewConstants.PREVIEW_STEP_SUCCESS,
      stepFields
    };
  }
  function failure(error) {
    return { type: stepPreviewConstants.PREVIEW_STEP_FAILURE, error };
  }
}
