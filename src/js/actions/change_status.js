import { changeStatusConstants } from "../constants";
import { changeStatusService } from "../services";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft",
    duration: 7
  });
};

export const changeStatusActions = payload => async dispatch => {
  dispatch({ type: changeStatusConstants.CHANGE_REQUEST, payload });
  try {
    const response = await changeStatusService.update(payload);
    dispatch({
      type: changeStatusConstants.CHANGE_SUCCESS,
      response: response
    });

    openNotificationWithIcon({
      type: "success",
      message: "Status changed."
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: changeStatusConstants.CHANGE_FAILURE, error });
    openNotificationWithIcon({
      type: "error",
      message: "Failed"
    });
    // dispatch(alertActions.error(error));
  }
};
