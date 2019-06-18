import { configConstants } from "../constants";
import { configService } from "../services";

export const configActions = {
  getConfig
};

function getConfig() {
  return dispatch => {
    //return {type:"hello"}
    // dispatch(request());  to prevent reloading of page

    configService
      .getConfig()
      .then(
        config => dispatch(success(config)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: configConstants.CONFIG_REQUEST };
  }
  function success(config) {
    return { type: configConstants.CONFIG_SUCCESS, config };
  }
  function failure(error) {
    return { type: configConstants.CONFIG_FAILURE, error };
  }
}
