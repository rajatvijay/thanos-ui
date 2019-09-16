import { message } from "antd";
import { fieldConstants } from "./constants";
import { fieldService } from "./services";
import { requiredParam } from "../common/errors";

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

const saveResponse = ({
  answer = requiredParam("answer"),
  fieldId = requiredParam("fieldId"),
  workflowId = requiredParam("workflowId"),
  extraJSON
}) => {
  const payload = {
    answer,
    field: fieldId,
    workflow: workflowId
  };
  if (extraJSON) {
    payload.extra_json = extraJSON;
  }
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

const clearResponse = ({
  workflowId = requiredParam("workflowId"),
  responseId = requiredParam("responseId"),
  payload
}) => {
  return dispatch => {
    dispatch(removeErrors({ workflowId }));
    dispatch(fieldSaveRequestAction({}));

    fieldService
      .clearResponse({ responseId, payload })
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
