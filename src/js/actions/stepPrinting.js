import { STEP_PRINT_STATE_TOGGLE } from "../constants";

export function togglePrintingState(value) {
  return { type: STEP_PRINT_STATE_TOGGLE, payload: value };
}
