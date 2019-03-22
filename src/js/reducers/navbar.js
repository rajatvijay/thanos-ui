import { navbarConstants } from "../constants";

export function showFilterMenu(state = { show: true }, action) {
  switch (action.type) {
    case navbarConstants.TOGGLE_SIDEBAR:
      return { show: action.show };
    case navbarConstants.SHOW_SIDEBAR:
      return { show: true };
    case navbarConstants.HIDE_SIDEBAR:
      return { show: false };
    default:
      return state;
  }
}
