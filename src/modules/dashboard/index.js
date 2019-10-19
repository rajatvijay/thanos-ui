import * as reducers from "./reducers";
import { combineReducers } from "redux";

export const workflowList = combineReducers({ ...reducers });

// TODO: default export the main component
