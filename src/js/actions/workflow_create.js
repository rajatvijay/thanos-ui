import { workflowCreateConstants } from "../constants";
import { workflowCreateService } from "../services";

export const createWorkflow = payload => async dispatch => {
  dispatch({ type: workflowCreateConstants.CREATE_REQUEST, payload });
  try {
    console.log("fffffff");
    const response = await workflowCreateService.crerateWorkflow(payload);
    console.log("eeeeeeee");
    dispatch({
      type: workflowCreateConstants.CREATE_SUCCESS,
      workflowCreate: response
    });
    console.log(response);
    //history.push("/");
  } catch (error) {
    console.log("error-");
    console.log(error);
    dispatch({ type: workflowCreateConstants.CREATE_FAILURE, error });
    // dispatch(alertActions.error(error));
  }
};
