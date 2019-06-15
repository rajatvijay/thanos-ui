import { workflowConstants, workflowFiltersConstants } from "../constants";
import { workflowService } from "../services";

export const workflowActions = {
  getAll,
  getById,
  delete: _delete,
  searchWorkflow,
  getChildWorkflow,
  expandedWorkflowsList,
  showUserWorkflowModal,
  hideUserWorkflowModal,
  clearAll
};

function getAll(filter) {
  return dispatch => {
    dispatch(request(filter));

    workflowService
      .getAll(filter)
      .then(
        workflow => dispatch(success(workflow)),
        error => dispatch(failure(error))
      );
  };
}

function clearAll() {
  return dispatch => {
    dispatch(clear());
    dispatch(request());

    workflowService
      .clearAll()
      .then(
        workflow => dispatch(success(workflow)),
        error => dispatch(failure(error))
      );
  };
}

function clear() {
  return { type: workflowFiltersConstants.CLEAR_FILTERS };
}

function request(filter) {
  return { type: workflowConstants.GETALL_REQUEST, filter };
}
function success(workflow) {
  return { type: workflowConstants.GETALL_SUCCESS, workflow };
}
function failure(error) {
  return { type: workflowConstants.GETALL_FAILURE, error };
}

function getById(id) {
  return dispatch => {
    dispatch(request(id));

    workflowService
      .getById(id)
      .then(
        workflow => dispatch(success(workflow.results)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowConstants.GET_REQUEST };
  }
  function success(workflow) {
    return { type: workflowConstants.GET_SUCCESS, workflow };
  }
  function failure(error) {
    return { type: workflowConstants.GET_FAILURE, error };
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id));

    workflowService.delete(id).then(
      workflow => {
        dispatch(success(id));
      },
      error => {
        dispatch(failure(id, error));
      }
    );
  };

  function request(id) {
    return { type: workflowConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: workflowConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: workflowConstants.DELETE_FAILURE, id, error };
  }
}

function searchWorkflow(query) {
  return dispatch => {
    dispatch(request(query));

    workflowService
      .searchWorkflow(query)
      .then(
        workflow => dispatch(success(workflow)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowConstants.SEARCH_REQUEST };
  }
  function success(workflow) {
    return { type: workflowConstants.SEARCH_SUCCESS, workflow };
  }
  function failure(error) {
    return { type: workflowConstants.SEARCH_FAILURE, error };
  }
}

function getChildWorkflow(parent) {
  return dispatch => {
    dispatch(request(parent));

    workflowService
      .getChildWorkflow(parent)
      .then(
        childWorkflow => dispatch(success(childWorkflow)),
        error => dispatch(failure(error))
      );
  };

  function request(parent) {
    let response = { [parent]: { loading: true } };

    return { type: workflowConstants.GET_CHILD_REQUEST, response };
  }

  function success(childWorkflow) {
    let response = {
      [parent]: { loading: false, children: childWorkflow.results }
    };

    return { type: workflowConstants.GET_CHILD_SUCCESS, response };
  }

  function failure(error) {
    let response = { [parent]: { loading: false, error: error } };
    return { type: workflowConstants.GET_CHILD_FAILURE, response };
  }
}

function expandedWorkflowsList(list) {
  return dispatch => {
    dispatch(request(list));
  };

  function request(list) {
    return { type: workflowConstants.EXPANDED_WORKFLOWS, payload: list };
  }
}

function showUserWorkflowModal({ workflowID }) {
  return {
    type: workflowConstants.SHOW_USER_WORKFLOW_MODAL,
    workflowID: workflowID
  };
}

function hideUserWorkflowModal() {
  return {
    type: workflowConstants.HIDE_USER_WORKFLOW_MODAL,
    workflowID: null
  };
}
