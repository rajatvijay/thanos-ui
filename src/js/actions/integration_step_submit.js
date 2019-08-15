import { dunsFieldConstants } from "../constants";
import { dunsFieldService } from "../services";
import { notification } from "antd";
// import { workflowDetailsActions } from "./workflow_details";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export const dunsFieldActions = {
  dunsSaveField,
  dunsSelectItem
};

////////////////////////////////
// update data on field change//
////////////////////////////////
function dunsSaveField(payload, stepId) {
  return dispatch => {
    dispatch(request(payload));

    dunsFieldService.saveDunsField(payload).then(
      field => {
        dispatch(success(field));
      },
      error => dispatch(failure(error))
    );
  };

  function request(payload) {
    return { type: dunsFieldConstants.DUNS_FIELD_REQUEST, payload, stepId };
  }

  function success(field) {
    // hack for to avoid response.json promise in case of failure
    if (!field.id) {
      return failure(field);
    }

    return { type: dunsFieldConstants.DUNS_FIELD_SUCCESS, field };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to save."
    });
    return { type: dunsFieldConstants.DUNS_FIELD_FAILURE, error, stepId };
  }
}

function dunsSelectItem(payload, stepId) {
  return dispatch => {
    dispatch(request(payload));

    dunsFieldService
      .selectDunsItem(payload)
      .then(
        field => dispatch(success(field)),
        error => dispatch(failure(error))
      );
  };

  function request(payload) {
    return { type: dunsFieldConstants.DUNS_SELECT_REQUEST, payload, stepId };
  }

  function success(field) {
    // hack for to avoid response.json promise in case of failure
    if (!field.id) {
      return failure(field);
    }

    openNotificationWithIcon({
      type: "success",
      message: "Saved successfully"
    });

    return { type: dunsFieldConstants.DUNS_SELECT_SUCCESS, field };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to save."
    });
    return { type: dunsFieldConstants.DUNS_SELECT_FAILURE, error, stepId };
  }
}
