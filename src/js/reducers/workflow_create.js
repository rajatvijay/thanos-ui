import { workflowCreateConstants } from "../constants";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export function workflowCreate(state = {}, action) {
  switch (action.type) {
    case workflowCreateConstants.CREATE_REQUEST:
      return {
        loading: true
        //workflowList: action.workflows,
      };
    case workflowCreateConstants.CREATE_SUCCESS:
      openNotificationWithIcon({
        type: "success",
        message: "Workflow created successfully"
      });

      return {
        loading: false,
        workflowCreate: action.workflowCreate
      };
    case workflowCreateConstants.CREATE_FAILURE:
      openNotificationWithIcon({
        type: "error",
        message: "Workflow creation failed.",
        body:
          "Failed to create workflow, sorry for the inconvenience. Contact care@thevetted.com for assistance"
      });

      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}
