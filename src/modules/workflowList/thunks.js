import {
  getStatusesList$$,
  getRegionsList$$,
  getBusinessUnitsList$$,
  getAllKinds$$,
  getAllAlerts$$,
  getAllTaskQueues$$
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
  setWorkflowFilter
} from "./actionCreators";

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

export const getBusinessUnitsThunk = () => {
  return async dispatch => {
    dispatch(getBusinessUnitsList());

    const [error, businessUnits] = await to(getBusinessUnitsList$$());

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

export const getAllAlertsThunk = () => {
  return async dispatch => {
    dispatch(getAllAlerts());

    const [error, alerts] = await to(getAllAlerts$$());

    if (error) {
      dispatch(getAllAlertsSuccess(error.message));
      throw error;
    }

    dispatch(getAllAlertsFailure(alerts));
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
  return async dispatch => {
    dispatch(setWorkflowFilter(filter));

    // TODO: Add logic for calling the API with filters

    if (filter.field === "kind") {
      dispatch(getAllTaskQueuesThunk(filter.value.tag));
    }
  };
}
