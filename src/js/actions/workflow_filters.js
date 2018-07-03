import { workflowFiltersConstants } from "../constants";
import { workflowFiltersService } from "../services";

export const workflowFiltersActions = {
  setFilters,
  getFilters,
  removeFilters,
  // getKindData,
  getStatusData
};

//set filter for workflow
function setFilters(payload) {
  //determine type of filter here
  //check for existing filters
  //append to exixting filters
  return dispatch => {
    dispatch({
      type: workflowFiltersConstants.SET_REQUEST,
      workflowFilter: payload
    });
  };
}

//Get current applied filter for workflow
function getFilters(payload) {
  //determine type of filter here
  //check for existing filters
  //append to exixting filters

  return dispatch => {
    console.log("payload------>>>>>>");
    console.log(payload);

    dispatch({
      type: workflowFiltersConstants.GET_REQUEST,
      workflowFilter: payload
    });
  };
}

//Remove applied filter
function removeFilters(payload) {
  //determine type of filter here
  //check for existing filters
  //append to exixting filters

  return dispatch => {
    dispatch({
      type: workflowFiltersConstants.REMOVE_REQUEST,
      workflowFilter: payload
    });
  };
}

//Workflow filter type (kind) data
// function getKindData() {
//     return dispatch => {
//     dispatch(request());

//     workflowFilterService
//       .getAll()
//       .then(
//         workflowFilterKind => dispatch(success(workflowFilterKind)),
//         error => dispatch(failure(error))
//       );
//   };

//   function request() {
//     return { type: workflowFilterConstants.GET_KIND_REQUEST };
//   }
//   function success(workflowFilterKind) {
//     return { type: workflowFilterConstants.GET_KIND_SUCCESS, workflowFilterKind };
//   }
//   function failure(error) {
//     return { type: workflowFilterConstants.GET_KIND_FAILURE, error };
//   }
// }

//Workflow filter type (status) data
function getStatusData() {
  return dispatch => {
    dispatch(request());

    workflowFiltersService
      .getStatusData()
      .then(
        workflowFilterStatus => dispatch(success(workflowFilterStatus)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowFiltersConstants.GET_STATUS_REQUEST };
  }
  function success(workflowFilterStatus) {
    return {
      type: workflowFiltersConstants.GET_STATUS_SUCCESS,
      workflowFilterStatus
    };
  }
  function failure(error) {
    return { type: workflowFiltersConstants.GET_STATUS_FAILURE, error };
  }
}
