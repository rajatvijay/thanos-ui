import { createStore as createStoreFromRedux, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { get as _get } from "lodash";

const componeseEnhancer = composeWithDevTools({ trace: true, traceLimit: 25 });
export const createStore = () =>
  createStoreFromRedux(
    rootReducer,
    componeseEnhancer(applyMiddleware(thunkMiddleware))
  );

export const getReduxKey = (key, defaultValue = undefined) =>
  _get({}, key, defaultValue);
