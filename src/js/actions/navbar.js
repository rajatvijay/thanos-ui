import { navbarConstants } from "../constants";

export const navbarActions = {
  toggleFilterMenu
};

function toggleFilterMenu(payload) {
  return dispatch => {
    dispatch({
      type: navbarConstants.TOGGLE_SIDEBAR,
      show: payload
    });
  };
}
