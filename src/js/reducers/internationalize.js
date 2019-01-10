import { languageConstants } from "../constants";

export function languageSelector(state = {}, action) {
  switch (action.type) {
    case languageConstants.LANGUAGE:
      return {
        type: "SELECT_LANGUAGE",
        language: action.message
      };
    default:
      return state;
  }
}
