import { WORKFLOW_SEARCH_VALUE_CHANGE } from "../constants";

export function changeSearchValue(value) {
  return { type: WORKFLOW_SEARCH_VALUE_CHANGE, payload: value };
}
