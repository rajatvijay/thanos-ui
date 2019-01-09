import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
//import registerServiceWorker from "./registerServiceWorker";
import messages from "./components/common/intlMessages";
import { addLocaleData, IntlProvider } from "react-intl";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import fr from "react-intl/locale-data/fr";
import { flattenMessages } from "./components/common/messageUtils";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./_helpers";
import "../css/App.css";
import "antd/dist/antd.css";

addLocaleData([...en, ...es, ...fr]);

let locale =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage ||
  "en-US";

let messageTranslate = messages[locale] || messages["en-US"];
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <IntlProvider
        locale={locale}
        messages={flattenMessages(messageTranslate)}
      >
        <App />
      </IntlProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

//registerServiceWorker();
