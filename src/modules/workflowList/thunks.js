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
  getAllTaskQueuesFailure
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

    dispatch(getRegionsListSuccess(regions));
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

    dispatch(getBusinessUnitsListSuccess(businessUnits));
    return businessUnits;
  };
};

export const getAllKindsThunk = () => {
  return async dispatch => {
    dispatch(getAllKinds());

    const [error, kinds] = await to(getAllKinds$$());

    if (error) {
      dispatch(getAllKindsSuccess(error.message));
      throw error;
    }

    dispatch(getAllKindsFailure(kinds));
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

export const getAllTaskQueuesThunk = () => {
  return async dispatch => {
    dispatch(getAllTaskQueues());

    const [error, taskQueues] = await to(getAllTaskQueues$$());

    if (error) {
      dispatch(getAllTaskQueuesSuccess(error.message));
      throw error;
    }

    dispatch(getAllTaskQueuesFailure(taskQueues));
    return taskQueues;
  };
};
