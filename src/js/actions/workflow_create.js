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
    // This is handled in WorkflowDetails that makes it navigate it to first incomplete step.
    const extra = "?new=true";
    history.push("/workflows/instances/" + response.id + extra);
    dispatch(workflowActions.getAll());
  } catch (error) {
    dispatch({ type: workflowCreateConstants.CREATE_FAILURE, error });
  }
};
