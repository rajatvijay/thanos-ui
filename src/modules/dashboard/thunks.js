import {
  getStatusesList$$,
  getRegionsList$$,
  getBusinessUnitsList$$,
  getAllKinds$$,
  getAllAlerts$$,
  getAllTaskQueues$$,
  getWorkflowList$$,
  getAdvancedFilterData$$,
  crerateWorkflow$$
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
  // setWorkflowFilter,
  getWorkflowList,
  getWorkflowListFailure,
  getWorkflowListSuccess,
  getAdvancedFilterData,
  getAdvancedFilterDataFailure,
  getAdvancedFilterDataSuccess,
  createWorklfow,
  createWorklfowFailure,
  createWorklfowSuccess
} from "./actionCreators";
// import { getWorkflowFitlersParams } from "./utils";
import { FILTERS_ENUM } from "./constants";

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

    // TODO: Move this logic out of this thunk
    // const defaultKind = kinds.results[0];
    // dispatch(applyWorkflowFilterThunk({ field: "kind", value: defaultKind }));
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

export function createWorkflowThunk(payload) {
  return async dispatch => {
    dispatch(createWorklfow());

    const [error, workflowData] = await to(crerateWorkflow$$(payload));

    if (error) {
      dispatch(createWorklfowFailure(error.message));
      throw error;
    }

    dispatch(createWorklfowSuccess(workflowData));
    return workflowData;
  };
}

// TODO: See if we can later move inside the component itself
export function applyFiltersFromStateThunk(callback) {
  return async (dispatch, getState) => {
    function createFilterParams() {
      const params = {};
      const filters = getState().workflowList.selectedWorkflowFilters;

      for (let filterName in filters) {
        const { key, value } = filters[filterName];
        params[key] = value;
      }

      if (params[FILTERS_ENUM.MY_TASK_FILTER.key]) {
        delete params[FILTERS_ENUM.KIND_FILTER.key];
      }

      return params;
    }
    await dispatch(getWorkflowListThunk(createFilterParams()));
    callback && callback();
  };
}
