import { navbarConstants } from "../constants";

export const navbarActions = {
  toggleFilterMenu,
  showFilterMenu,
  hideFilterMenu,
  toggleRightSidebar
};

function toggleFilterMenu(payload) {
  return dispatch => {
    dispatch({
      type: navbarConstants.TOGGLE_SIDEBAR,
      show: payload
    });
  };
}

function showFilterMenu() {
  return dispatch => {
    dispatch({
      type: navbarConstants.SHOW_SIDEBAR
    });
  };
}

function hideFilterMenu() {
  return dispatch => {
    dispatch({
      type: navbarConstants.HIDE_SIDEBAR
    });
  };
}

function toggleRightSidebar(payload) {
  return dispatch => {
    dispatch({
      type: navbarConstants.TOGGLE_RIGHT_SIDEBAR,
      show: payload
    });
  };
}
