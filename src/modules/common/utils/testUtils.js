import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { flattenMessages } from "../../../js/components/common/messageUtils";
import inltMessages from "../../../js/components/common/intlMessages";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../../js/reducers";
import thunkMiddlware from "redux-thunk";

const DEFAULT_LOCALE = "en";

const enMessagesRecords = flattenMessages(inltMessages[DEFAULT_LOCALE]);

export const renderWithReactIntl = component => {
  return render(
    <IntlProvider locale={DEFAULT_LOCALE} messages={enMessagesRecords}>
      {component}
    </IntlProvider>
  );
};

export const renderWithRedux = (
  ui,
  {
    initialState,
    store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunkMiddlware)
    )
  } = {},
  useIntl = true
) => {
  const renderFunction = useIntl ? renderWithReactIntl : render;
  return {
    ...renderFunction(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store
  };
};
