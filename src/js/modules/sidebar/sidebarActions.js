import { authHeader, baseUrl } from "../../_helpers";
import {
  TASK_QUEUE_COUNT_FAILURE,
  TASK_QUEUE_COUNT_SUCCESS
} from "./sidebarActionTypes";
import axios from "axios";

export const taskQueueCount = () => async dispatch => {
  // const res = await axios.get(`${baseUrl}get-my-tagged-incomplete-steps/`, {
  //     credentials: "include",
  //     headers: {
  //       headers: authHeader.get()
  //     }
  //   });
  const res = await new Promise(function(resolve, reject) {
    resolve({
      payload: {
        assigned: 2,
        responsible: 1
      }
    });
  });
  console.log("response", res);

  try {
    dispatch({ type: TASK_QUEUE_COUNT_SUCCESS, payload: res.payload });
  } catch (err) {
    dispatch({ type: TASK_QUEUE_COUNT_FAILURE, payload: err });
  }
};