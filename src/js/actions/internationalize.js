import { languageConstants } from "../constants";
import { updateSelectedLanguageService } from "../services";

function setLanguage(message) {
  return { type: languageConstants.LANGUAGE, message };
}

const updateUserLanguage = payload => async dispatch => {
  dispatch({ type: languageConstants.CHANGE_LANGUAGE_REQUEST, payload });
  try {
    const response = await updateSelectedLanguageService.updateSelectedLanguage(
      payload
    );
    dispatch(setLanguage(payload));
    dispatch({
      type: languageConstants.CHANGE_LANGUAGE_SUCCESS,
      response: response
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: languageConstants.CHANGE_LANGUAGE_FAILURE, error });
    dispatch(setLanguage(payload));
  }
};

export const languageActions = {
  setLanguage,
  updateUserLanguage
};
