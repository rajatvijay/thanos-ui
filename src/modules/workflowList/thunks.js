import {
  getStatusesList$$,
  getRegionsList$$,
  getBusinessUnitsList$$,
  getAllKinds$$,
  getAllAlerts$$,
  getAllTaskQueues$$,
  getWorkflowList$$,
  getAdvancedFilterData$$
} from "./services";
import { to } from "await-to-js";
import {
  getStatusesList,
  getRegionsList,
  getBusinessUnitsList,
  getStatusesListSuccess,
  getStatusesListFailure,
  getRegionsListSuccess,
  getRegionsListFailure,
  getBusinessUnitsListSuccess,
  getBusinessUnitsListFailure,
  getAllKinds,
  getAllKindsSuccess,
  getAllKindsFailure,
  getAllAlerts,
  getAllAlertsSuccess,
  getAllAlertsFailure,
  getAllTaskQueues,
  getAllTaskQueuesSuccess,
  getAllTaskQueuesFailure,
  setWorkflowFilter,
  getWorkflowList,
  getWorkflowListFailure,
  getWorkflowListSuccess,
  getAdvancedFilterData,
  getAdvancedFilterDataFailure,
  getAdvancedFilterDataSuccess
} from "./actionCreators";
import { getWorkflowFitlersParams } from "./utils";
import { KIND_FILTER_NAME, REGION_FILTER_NAME } from "./constants";

export const getStatusesThunk = () => {
  return async dispatch => {
    dispatch(getStatusesList());
    const [error, statuses] = await to(getStatusesList$$());

    if (error) {
      dispatch(getStatusesListFailure(error.message));
      throw error;
    }

    dispatch(getStatusesListSuccess(statuses));
    return statuses;
  };
};

export const getRegionsThunk = () => {
  return async dispatch => {
    dispatch(getRegionsList());

    const [error, regions] = await to(getRegionsList$$());

    if (error) {
      dispatch(getRegionsListFailure(error.message));
      throw error;
    }

    dispatch(getRegionsListSuccess(regions.results));
    return regions;
  };
};

export const getBusinessUnitsThunk = regionCode => {
  return async dispatch => {
    dispatch(getBusinessUnitsList());

    const [error, businessUnits] = await to(getBusinessUnitsList$$(regionCode));

    if (error) {
      dispatch(getBusinessUnitsListFailure(error.message));
      throw error;
    }

    dispatch(getBusinessUnitsListSuccess(businessUnits.results));
    return businessUnits;
  };
};

export const getAllKindsThunk = () => {
  return async dispatch => {
    dispatch(getAllKinds());

    const [error, kinds] = await to(getAllKinds$$());

    if (error) {
      dispatch(getAllKindsFailure(error.message));
      throw error;
    }

    const defaultKind = kinds.results[0];
    dispatch(applyWorkflowFilterThunk({ field: "kind", value: defaultKind }));
    dispatch(getAllKindsSuccess(kinds));
    return kinds;
  };
};

export const getAllAlertsThunk = kindTag => {
  return async dispatch => {
    dispatch(getAllAlerts());

    const [error, alerts] = await to(getAllAlerts$$(kindTag));

    if (error) {
      dispatch(getAllAlertsFailure(error.message));
      throw error;
    }

    dispatch(getAllAlertsSuccess(alerts.alert_details));
    return alerts;
  };
};

export const getAllTaskQueuesThunk = kindTag => {
  return async dispatch => {
    dispatch(getAllTaskQueues());

    const [error, taskQueues] = await to(getAllTaskQueues$$(kindTag));

    if (error) {
      dispatch(getAllTaskQueuesFailure(error.message));
      throw error;
    }

    dispatch(getAllTaskQueuesSuccess(taskQueues.stepgroupdef_counts));
    return taskQueues;
  };
};

export function applyWorkflowFilterThunk(filter) {
  return async (dispatch, getState) => {
    dispatch(setWorkflowFilter(filter));

    // TODO: Add logic for calling the API with filters

    if (filter.field === KIND_FILTER_NAME) {
      dispatch(getAllTaskQueuesThunk(filter.value.tag));
      dispatch(getAllAlertsThunk(filter.value.tag));
      dispatch(getAdvancedFilterDataThunk(filter.value.tag));
    }

    if (filter.field === REGION_FILTER_NAME) {
      dispatch(getBusinessUnitsThunk(filter.value.value));
    }

    // Call the workflow list API
    const filtersFromState = getState().workflowList.selectedWorkflowFilters;
    const filterParams = getWorkflowFitlersParams(filtersFromState);
    dispatch(getWorkflowListThunk(filterParams));
  };
}

export function getWorkflowListThunk(params) {
  return async dispatch => {
    dispatch(getWorkflowList());

    const [error, workflows] = await to(getWorkflowList$$(params));

    if (error) {
      dispatch(getWorkflowListFailure(error.message));
      throw error;
    }

    dispatch(getWorkflowListSuccess(workflows));
    return workflows;
  };
}

export function getAdvancedFilterDataThunk(kindTag) {
  return async dispatch => {
    dispatch(getAdvancedFilterData());

    const [error, filterData] = await to(getAdvancedFilterData$$(kindTag));

    if (error) {
      dispatch(getAdvancedFilterDataFailure(error.message));
      throw error;
    }

    dispatch(getAdvancedFilterDataSuccess(filterData.results));
    return filterData;
  };
}
