import {
  TASK_QUEUE_COUNT_FAILURE,
  TASK_QUEUE_COUNT_SUCCESS
} from "./sidebarActionTypes";

export const taskQueueCount = () => async dispatch => {
  const res = await new Promise(function(resolve, reject) {
    resolve({
      payload: {
        assigned: 2,
        responsible: 1
      }
    });
  });

  try {
    dispatch({ type: TASK_QUEUE_COUNT_SUCCESS, payload: res.payload });
  } catch (err) {
    dispatch({ type: TASK_QUEUE_COUNT_FAILURE, payload: err });
  }
};
