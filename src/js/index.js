import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./_helpers";
import "../css/App.css";
import "antd/dist/antd.css";
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://ff52fd0ac35549418978a4f7aa94c7c7@sentry.io/1382744"
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
