import { message } from "antd";
import { fieldConstants } from "./constants";
import { fieldService } from "./services";

const removeErrors = ({ workflowId }) => {
  return {
    type: fieldConstants.RESPONSE_SAVE_FAILURE,
    workflowId
  };
};

const fieldSaveRequestAction = payload => {
  // TODO: Loading message is a side-effect and should be handled separately
  message.loading("", 0);
  return { type: fieldConstants.RESPONSE_SAVE_REQUEST, payload };
};

const fieldSaveSuccessAction = step => {
  message.destroy();
  return { type: fieldConstants.RESPONSE_SAVE_SUCCESS, step };
};

const fieldSaveErrorAction = (error, workflowId) => {
  message.destroy();
  return {
    type: fieldConstants.RESPONSE_SAVE_FAILURE,
    error,
    workflowId
  };
};

const saveResponse = ({ answer, fieldId, workflowId }) => {
  const payload = { answer, fieldId, workflowId };
  return dispatch => {
    dispatch(removeErrors({ workflowId }));
    dispatch(fieldSaveRequestAction(payload));

    fieldService
      .saveResponse(payload)
      .then(
        step => dispatch(fieldSaveSuccessAction(step)),
        error => dispatch(fieldSaveErrorAction(error, workflowId))
      );
  };
};

const clearResponse = ({ workflowId, responseId }) => {
  return dispatch => {
    dispatch(removeErrors({ workflowId }));
    dispatch(fieldSaveRequestAction({}));

    fieldService
      .clearResponse({ responseId })
      .then(
        step => dispatch(fieldSaveSuccessAction(step)),
        error => dispatch(fieldSaveErrorAction(error, workflowId))
      );
  };
};

/**
 * TODO: Create these functions when required
 * const saveAttachment = ({ attachment, fieldId, workflowId }) => {};
 * const clearAttachment = ({ responseId, workflowId }) => {};
 */

export const fieldActions = {
  saveResponse,
  clearResponse
};
