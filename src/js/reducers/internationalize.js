import { languageConstants } from "../constants";

export function languageSelector(state = {}, action) {
  switch (action.type) {
    case languageConstants.LANGUAGE:
      return {
        type: "SELECT_LANGUAGE",
        language: action.message
      };
    case languageConstants.CHANGE_LANGUAGE_REQUEST:
      return {
        loading: true
      };
    case languageConstants.CHANGE_LANGUAGE_SUCCESS:
      return {
        loading: false,
        preferredLanguage: action.response.prefered_language
      };
    case languageConstants.CHANGE_LANGUAGE_FAILURE:
      return {
        loading: false,
        loadingStatus: "failed",
        error: action.error
      };
    default:
      return state;
  }
}
