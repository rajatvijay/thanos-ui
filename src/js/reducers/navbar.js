import { navbarConstants } from "../constants";

export function showFilterMenu(state = { show: true }, action) {
  switch (action.type) {
    case navbarConstants.TOGGLE_SIDEBAR:
      return { show: action.show };
    default:
      return state;
  }
}
