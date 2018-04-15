import { workflowCreateConstants } from "../constants";
import { workflowCreateService } from "../services";

export const createWorkflow = payload => async dispatch => {
  dispatch({ type: workflowCreateConstants.CREATE_REQUEST, payload });
  try {
    const response = await workflowCreateService.crerateWorkflow(payload);
    dispatch({
      type: workflowCreateConstants.CREATE_SUCCESS,
      workflowCreate: response
    });
    console.log("eeeeeeee");
    console.log(response);
    //history.push("/");
  } catch (error) {
    console.log(error);
    dispatch({ type: workflowCreateConstants.CREATE_FAILURE, error });
    // dispatch(alertActions.error(error));
  }
};
