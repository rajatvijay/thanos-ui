import { workflowCreateConstants } from "../constants";
import { workflowCreateService } from "../services";
import { workflowActions } from "../actions";
import { history } from "../_helpers";
import { message } from "antd";
import showNotification from "../../modules/common/notification";
import { showMessage } from "../../modules/common/message";

export const createWorkflow = payload => async dispatch => {
  dispatch({ type: workflowCreateConstants.CREATE_REQUEST, payload });
  showMessage("loading", "workflowsInstances.preparingForms", 0);

  try {
    const response = await workflowCreateService.createWorkflow(payload);
    dispatch({
      type: workflowCreateConstants.CREATE_SUCCESS,
      workflowCreate: response
    });
    showNotification({
      type: "success",
      message: "notificationInstances.workflowCreateSuccess"
    });

    // This is handled in WorkflowDetails that makes it navigate it to first incomplete step.
    const extra = "?new=true";
    history.push("/workflows/instances/" + response.id + extra);
    dispatch(workflowActions.getAll());
  } catch (error) {
    dispatch({ type: workflowCreateConstants.CREATE_FAILURE, error });
    showNotification({
      type: "error",
      message: "notificationInstances.workflowCreateFail",
      description: "notificationInstances.workflowCreateFailDescription"
    });
  } finally {
    message.destroy();
  }
};
