import { languageConstants } from "../constants";

export const languageActions = {
  setLanguage
};

function setLanguage(message) {
  return { type: languageConstants.LANGUAGE, message };
}
