import { workflowCreateConstants } from "../constants";
import { workflowCreateService } from "../services";
import { workflowActions } from "../actions";
import { history } from "../_helpers";

export const createWorkflow = payload => async dispatch => {
  dispatch({ type: workflowCreateConstants.CREATE_REQUEST, payload });
  try {
    const response = await workflowCreateService.crerateWorkflow(payload);
    dispatch({
      type: workflowCreateConstants.CREATE_SUCCESS,
      workflowCreate: response
    });
    history.push("/workflows/instances/" + response.id);
    dispatch(workflowActions.getAll());
  } catch (error) {
    console.log(error);
    dispatch({ type: workflowCreateConstants.CREATE_FAILURE, error });
  }
};
