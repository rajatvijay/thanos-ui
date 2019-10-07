import { changeStatusConstants, workflowCommentsConstants } from "../constants";
import { changeStatusService } from "../services";
import { notification } from "antd";
import { workflowDetailsActions } from "../actions";
import _ from "lodash";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export const changeStatusActions = (
  payload,
  step_reload_payload,
  isEmbedded,
  fieldExtra
) => async dispatch => {
  dispatch({ type: changeStatusConstants.CHANGE_REQUEST, payload });
  try {
    const response = await changeStatusService.update(payload);
    response.fieldExtra = fieldExtra;
    dispatch({
      type: changeStatusConstants.CHANGE_SUCCESS,
      response: response
    });

    if (_.size(step_reload_payload)) {
      dispatch(workflowDetailsActions.getStepFields(step_reload_payload));
    }

    openNotificationWithIcon({
      type: "success",
      message: "Status changed."
    });
    if (payload.addComment) {
      response.fieldExtra = fieldExtra;
      dispatch({
        type: workflowCommentsConstants.ADD_COMMENTS_SUCCESS,
        response
      });
    }
  } catch (error) {
    dispatch({ type: changeStatusConstants.CHANGE_FAILURE, error });
    openNotificationWithIcon({
      type: "error",
      message: "Failed"
    });
  }
};
