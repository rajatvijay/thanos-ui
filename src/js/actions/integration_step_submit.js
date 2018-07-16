import { dunsFieldConstants } from "../constants";
import { dunsFieldService } from "../services";
import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

export const dunsFieldActions = {
  dunsSaveField
};

////////////////////////////////
// update data on field change//
////////////////////////////////
function dunsSaveField(payload) {
  console.log("dispatched=-------");
  return dispatch => {
    dispatch(request(payload));
    //dispatch(remove_errors({}));

    dunsFieldService
      .dunsSaveField(payload)
      .then(
        field => dispatch(success(field)),
        error => dispatch(failure(error))
      );
  };

  function request(payload) {
    console.log("requested=-------");
    return { type: dunsFieldConstants.DUNS_FIELD_REQUEST, payload };
  }

  function remove_errors(payload) {
    console.log("errorree=-------");
    return { type: dunsFieldConstants.DUNS_FIELD_FAILURE, payload };
  }

  function success(field) {
    // hack for to avoid response.json promise in case of failure
    if (!field.id) {
      console.log("success=-------");
      return failure(field);
    }

    openNotificationWithIcon({
      type: "success",
      message: "Saved successfully"
    });

    return { type: dunsFieldConstants.DUNS_FIELD_SUCCESS, field };
  }

  function failure(error) {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to save."
    });
    return { type: dunsFieldConstants.DUNS_FIELD_FAILURE, error };
  }
}
