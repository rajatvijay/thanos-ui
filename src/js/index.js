import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import App from "./App";
import { Provider } from "react-redux";
//import store from "./_helpers/store";
import { store } from './_helpers';
import "../css/App.css";
import "antd/dist/antd.css";

// setup fake backend
import { configureFakeBackend } from './_helpers';

configureFakeBackend();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();

