import { STEP_PRINT_STATE_TOGGLE } from "../constants";

export default function isStepPrinting(state = false, action) {
  const { payload } = action;

  switch (action.type) {
    case STEP_PRINT_STATE_TOGGLE:
      return payload;
    default:
      return state;
  }
}
