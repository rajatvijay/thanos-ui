import * as reducers from "./reducers";
import { combineReducers } from "redux";
import Dashboard from "./workflowList";

export const workflowList = combineReducers({ ...reducers });

export default Dashboard;
