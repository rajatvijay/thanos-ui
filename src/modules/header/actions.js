import { languageConstants } from "./constants";
import { updateSelectedLanguage } from "./services";

function setLanguage(message) {
  return { type: languageConstants.LANGUAGE, message };
}

const updateUserLanguage = payload => async dispatch => {
  dispatch({ type: languageConstants.CHANGE_LANGUAGE_REQUEST, payload });
  try {
    const response = await updateSelectedLanguage(payload);
    dispatch(setLanguage(payload));
    dispatch({
      type: languageConstants.CHANGE_LANGUAGE_SUCCESS,
      response: response
    });

    // To relfect the selected language on the whole app and backend
    window.location.reload();
  } catch (error) {
    // console.log(error);
    dispatch({ type: languageConstants.CHANGE_LANGUAGE_FAILURE, error });
    dispatch(setLanguage(payload));
  }
};

export const languageActions = {
  setLanguage,
  updateUserLanguage
};
