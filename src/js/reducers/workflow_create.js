import { workflowCreateConstants } from "../constants";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body
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
        message: "Workflow created successfully",
        placement: "bottomLeft",
        body: ""
      });

      return {
        loading: false,
        workflowCreate: action.workflowCreate
      };
    case workflowCreateConstants.CREATE_FAILURE:
      openNotificationWithIcon({
        type: "error",
        placement: "bottomLeft",
        message: "Workflow creatation failed.",
        body:
          "Failed to create workflow, sorry for the inconvenience. Please try again later"
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
