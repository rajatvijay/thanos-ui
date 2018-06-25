import { configConstants } from "../constants";

const initialState = {};

export function config(state = initialState, action) {
  switch (action.type) {
    //GET CONFIG FOR CURRENT SCHEMA
    case configConstants.CONFIG_REQUEST:
      return {
        loading: true
      };
    case configConstants.CONFIG_SUCCESS:
      return {
        ...action.config
      };
    case configConstants.CONFIG_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}
