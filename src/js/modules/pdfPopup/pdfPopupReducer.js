import {
  GET_PDF_DATA,
  GET_PDF_DATA_SUCCESS,
  GET_PDF_DATA_FAILURE,
  POST_PDF_DATA,
  POST_PDF_DATA_SUCCESS,
  POST_PDF_DATA_FAILURE
} from "./pdfPopupActionTypes";

export default function taskQueueCount(
  state = { data: {}, err: null, isLoading: false },
  action
) {
  const { type, payload } = action;

  switch (type) {
    case GET_PDF_DATA:
      return { ...state, isLoading: true };

    case GET_PDF_DATA_SUCCESS:
      return { ...state, data: payload, isLoading: false };

    case GET_PDF_DATA_FAILURE:
      return { ...state, err: payload, isLoading: false };

    case POST_PDF_DATA:
      return { ...state, isLoading: true };

    case POST_PDF_DATA_SUCCESS:
      return { ...state, postData: payload, isLoading: false };

    case POST_PDF_DATA_FAILURE:
      return { ...state, err: payload, isLoading: true };

    default:
      return state;
  }
}
