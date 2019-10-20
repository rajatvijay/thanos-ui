import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//import registerServiceWorker from "./registerServiceWorker";
import App from "./js/App";
import { Provider } from "react-redux";
import { createStore } from "./js/_helpers";
import "./css/App.css";
import "antd/dist/antd.css";
import * as Sentry from "@sentry/browser";
import { tenant, envTag } from "./config";

if (process.env.REACT_APP_DISABLE_SENTRY !== "true") {
  Sentry.init({
    dsn: "https://ff52fd0ac35549418978a4f7aa94c7c7@sentry.io/1382744",
    environment: envTag
  });

  Sentry.configureScope(scope => {
    scope.setTag("tenant", tenant);
  });
}

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

//registerServiceWorker();
