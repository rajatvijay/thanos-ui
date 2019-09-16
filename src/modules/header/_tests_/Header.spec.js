import React from "react";
import Header from "../components/Header";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { workflowKind } from "../../../js/reducers/workflow_kind";
import { authentication } from "../../../js/reducers/authentication";
import { config } from "../../../js/reducers/config";
import workflowSearch from "../../../js/reducers/workflowSearch";
import { renderWithReactIntl } from "../../common/testUtils";
import { permissions } from "../../../modules/common/permissions/reducer";
import { BrowserRouter } from "react-router-dom";

test("should render the client name when config has loaded and url is in the config", () => {
  const fakeClientImage = "Fake image url";
  const fakeClientName = "Fake Client name";
  const rootReducer = combineReducers({
    workflowSearch,
    workflowKind,
    authentication,
    config
  });
  const store = createStore(rootReducer, {
    config: {
      loading: false,
      logo: fakeClientImage,
      name: fakeClientName
    }
  });
  const { queryByAltText } = renderWithReactIntl(
    <Provider store={store}>
      <Header />
    </Provider>
  );
  expect(queryByAltText(fakeClientName)).toBeInTheDocument();
});

test("should render search bar", () => {
  const rootReducer = combineReducers({
    workflowSearch,
    workflowKind,
    authentication,
    config
  });
  const store = createStore(rootReducer, {
    config: {
      loading: false
    }
  });
  const { getByTestId } = renderWithReactIntl(
    <Provider store={store}>
      <Header />
    </Provider>
  );
  expect(getByTestId("search-bar")).toBeInTheDocument();
});

test("should render export data icon when the user has the permissions", () => {
  const rootReducer = combineReducers({
    workflowSearch,
    workflowKind,
    authentication,
    config
  });
  const store = createStore(rootReducer, {
    config: {
      loading: false,
      report_embed_url: "My Fake URL"
    },
    authentication: {
      user: {
        features: ["view_reports"]
      }
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );
  expect(queryByText(/trending_up/i)).toBeInTheDocument();
});

test("should render export workflow data icon when user has the permission", () => {
  const rootReducer = combineReducers({
    workflowSearch,
    workflowKind,
    authentication,
    config,
    permissions
  });
  const store = createStore(rootReducer, {
    config: {
      loading: false
    },
    workflowKind: {
      workflowKind: [
        {
          id: 1,
          name: "Entity",
          is_related_kind: false,
          features: ["add_workflow"],
          icon: "create"
        }
      ]
    },
    permissions: {
      permissions: {
        codename: "export_data",
        name: "Can export workflow data"
      }
    }
  });
  const { getByLabelText } = renderWithReactIntl(
    <Provider store={store}>
      <Header />
    </Provider>
  );
  expect(getByLabelText("icon: download")).toBeInTheDocument();
});

test("should render menu list icon along with list when user is logged in", () => {
  const rootReducer = combineReducers({
    workflowSearch,
    workflowKind,
    authentication,
    config
  });
  const store = createStore(rootReducer, {
    config: {
      loading: false
    },
    authentication: {
      user: {
        id: 1,
        email: "xyz"
      }
    }
  });
  const { getByLabelText } = renderWithReactIntl(
    <Provider store={store}>
      <Header />
    </Provider>
  );
  expect(getByLabelText("icon: ellipsis")).toBeInTheDocument();
});
