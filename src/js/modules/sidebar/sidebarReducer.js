import {
  TASK_QUEUE_COUNT_FAILURE,
  TASK_QUEUE_COUNT_SUCCESS
} from "./sidebarActionTypes";

export default function taskQueueCount(
  state = { count: null, err: null },
  action
) {
  const { type, payload } = action;

  switch (type) {
    case TASK_QUEUE_COUNT_SUCCESS:
      return { ...state, count: payload.assigned };

    case TASK_QUEUE_COUNT_FAILURE:
      return { ...state, err: payload };

    default:
      return state;
  }
}
