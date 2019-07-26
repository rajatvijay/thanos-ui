import { TOGGLE_MINIMALUI } from "../constants";

export default function workflowKeys(state = false, action) {
  switch (action.type) {
    case TOGGLE_MINIMALUI:
      state = !state;
      return state;

    default:
      return state;
  }
}
