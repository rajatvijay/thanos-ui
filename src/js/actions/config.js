import { configConstants } from "../constants";
import { configService } from "../services";

export const configActions = {
  getConfig
};

function getConfig() {
  return dispatch => {
    configService
      .getConfig()
      .then(
        config => dispatch(success(config)),
        error => dispatch(failure(error))
      );
  };

  function success(config) {
    return { type: configConstants.CONFIG_SUCCESS, config };
  }
  function failure(error) {
    return { type: configConstants.CONFIG_FAILURE, error };
  }
}
