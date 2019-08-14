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
    let extra = "";
    // Currently this only happens for child workflows
    // that is, if you create a child workflow,
    // it will navigate it to the first step of it.
    // But, if you want to always go to the first step
    // always, regardless if it's child workflow or a
    // parent-less workflow, pass neew=true in params
    if (!!payload.parent) extra = "?new=true";
    history.push("/workflows/instances/" + response.id + extra);
    dispatch(workflowActions.getAll());
  } catch (error) {
    dispatch({ type: workflowCreateConstants.CREATE_FAILURE, error });
  }
};
