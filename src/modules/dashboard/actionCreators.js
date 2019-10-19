import { makeActionCreator } from "../common/utils";
import {
  GET_STATUSES_LIST,
  GET_REGIONS_LIST,
  GET_BUSINESS_UNITS_LIST,
  GET_STATUSES_LIST_SUCCESS,
  GET_STATUSES_LIST_FAILURE,
  GET_REGIONS_LIST_SUCCESS,
  GET_REGIONS_LIST_FAILURE,
  GET_BUSINESS_UNITS_LIST_SUCCESS,
  GET_BUSINESS_UNITS_LIST_FAILURE,
  GET_ALL_KINDS,
  GET_ALL_KINDS_SUCCESS,
  GET_ALL_KINDS_FAILURE,
  GET_ALL_ALERTS,
  GET_ALL_ALERTS_SUCCESS,
  GET_ALL_ALERTS_FAILURE,
  GET_ALL_TASK_QUEUES,
  GET_ALL_TASK_QUEUES_SUCCESS,
  GET_ALL_TASK_QUEUES_FAILURE,
  SET_WORKFLOW_FILTER,
  REMOVE_WORKFLOW_FILTER,
  GET_WORKFLOW_LIST,
  GET_WORKFLOW_LIST_SUCCESS,
  GET_WORKFLOW_LIST_FAILURE,
  GET_ADVANCED_FILTER_DATA,
  GET_ADVANCED_FILTER_DATA_SUCCESS,
  GET_ADVANCED_FILTER_DATA_FAILURE,
  CREATE_WORKFLOW,
  CREATE_WORKFLOW_SUCCESS,
  CREATE_WORKFLOW_FAILURE
} from "./actions";

export const getStatusesList = makeActionCreator(GET_STATUSES_LIST);
export const getStatusesListSuccess = makeActionCreator(
  GET_STATUSES_LIST_SUCCESS
);
export const getStatusesListFailure = makeActionCreator(
  GET_STATUSES_LIST_FAILURE
);

export const getRegionsList = makeActionCreator(GET_REGIONS_LIST);
export const getRegionsListSuccess = makeActionCreator(
  GET_REGIONS_LIST_SUCCESS
);
export const getRegionsListFailure = makeActionCreator(
  GET_REGIONS_LIST_FAILURE
);

export const getBusinessUnitsList = makeActionCreator(GET_BUSINESS_UNITS_LIST);
export const getBusinessUnitsListSuccess = makeActionCreator(
  GET_BUSINESS_UNITS_LIST_SUCCESS
);
export const getBusinessUnitsListFailure = makeActionCreator(
  GET_BUSINESS_UNITS_LIST_FAILURE
);

export const getAllKinds = makeActionCreator(GET_ALL_KINDS);
export const getAllKindsSuccess = makeActionCreator(GET_ALL_KINDS_SUCCESS);
export const getAllKindsFailure = makeActionCreator(GET_ALL_KINDS_FAILURE);

export const getAllAlerts = makeActionCreator(GET_ALL_ALERTS);
export const getAllAlertsSuccess = makeActionCreator(GET_ALL_ALERTS_SUCCESS);
export const getAllAlertsFailure = makeActionCreator(GET_ALL_ALERTS_FAILURE);

export const getAllTaskQueues = makeActionCreator(GET_ALL_TASK_QUEUES);
export const getAllTaskQueuesSuccess = makeActionCreator(
  GET_ALL_TASK_QUEUES_SUCCESS
);
export const getAllTaskQueuesFailure = makeActionCreator(
  GET_ALL_TASK_QUEUES_FAILURE
);

export const setWorkflowFilter = makeActionCreator(SET_WORKFLOW_FILTER);
export const removeWorkflowFilter = makeActionCreator(REMOVE_WORKFLOW_FILTER);

export const getWorkflowList = makeActionCreator(GET_WORKFLOW_LIST);
export const getWorkflowListSuccess = makeActionCreator(
  GET_WORKFLOW_LIST_SUCCESS
);
export const getWorkflowListFailure = makeActionCreator(
  GET_WORKFLOW_LIST_FAILURE
);

export const getAdvancedFilterData = makeActionCreator(
  GET_ADVANCED_FILTER_DATA
);
export const getAdvancedFilterDataSuccess = makeActionCreator(
  GET_ADVANCED_FILTER_DATA_SUCCESS
);
export const getAdvancedFilterDataFailure = makeActionCreator(
  GET_ADVANCED_FILTER_DATA_FAILURE
);

export const createWorklfow = makeActionCreator(CREATE_WORKFLOW);
export const createWorklfowSuccess = makeActionCreator(CREATE_WORKFLOW_SUCCESS);
export const createWorklfowFailure = makeActionCreator(CREATE_WORKFLOW_FAILURE);
