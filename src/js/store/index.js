import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import reducers from "../reducers/root-reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = applyMiddleware(promise(), thunk);

const store = createStore(reducers, composeWithDevTools(middleware));

export default store;
