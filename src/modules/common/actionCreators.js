import { makeActionCreator } from "./utils";
import {
  GET_STATUSES_LIST,
  GET_REGIONS_LIST,
  GET_BUSINESS_UNITS_LIST,
  GET_STATUSES_LIST_SUCCESS,
  GET_STATUSES_LIST_FAILURE,
  GET_REGIONS_LIST_SUCCESS,
  GET_REGIONS_LIST_FAILURE,
  GET_BUSINESS_UNITS_LIST_SUCCESS,
  GET_BUSINESS_UNITS_LIST_FAILURE
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
