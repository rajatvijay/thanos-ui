import { workflowFiltersConstants } from "../constants";
import { workflowFiltersService } from "../services";

export const workflowFiltersActions = {
  setFilters,
  getFilters,
  removeFilters,
  // getKindData,
  getStatusData,
  getBusinessUnitData,
  getRegionData
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

function getBusinessUnitData() {
  return dispatch => {
    dispatch(request());

    workflowFiltersService
      .getBusinessData()
      .then(
        workflowFilterBusiness => dispatch(success(workflowFilterBusiness)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowFiltersConstants.GET_BUSINESS_UNIT_REQUEST };
  }
  function success(workflowFilterBusiness) {
    return {
      type: workflowFiltersConstants.GET_BUSINESS_UNIT_SUCCESS,
      workflowFilterBusiness
    };
  }
  function failure(error) {
    return { type: workflowFiltersConstants.GET_BUSINESS_UNIT_FAILURE, error };
  }
}

function getRegionData() {
  return dispatch => {
    dispatch(request());

    workflowFiltersService
      .getRegionData()
      .then(
        workflowFilterRegion => dispatch(success(workflowFilterRegion)),
        error => dispatch(failure(error))
      );
  };

  function request() {
    return { type: workflowFiltersConstants.GET_REGION_REQUEST };
  }
  function success(workflowFilterRegion) {
    return {
      type: workflowFiltersConstants.GET_REGION_SUCCESS,
      workflowFilterRegion
    };
  }
  function failure(error) {
    return { type: workflowFiltersConstants.GET_REGION_FAILURE, error };
  }
}
