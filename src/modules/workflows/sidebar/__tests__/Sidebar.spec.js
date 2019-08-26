import React from "react";
import Sidebar from "../components/Sidebar";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { workflowDetailsHeader } from "../../../../js/reducers/workflow_details_header";
import { config } from "../../../../js/reducers/config";
import { renderWithReactIntl } from "../../../common/testUtils";
import { BrowserRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";
import Permissions from "../../../common/permissions/constants";

// Fake Data
const fakeWorkflowId = 3120;
const fakeWorkflowName = "Current Workflow";

// Tests start here
test("should render current workflow name", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {}
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
    </Provider>
  );
  expect(queryByText("Current Workflow")).toBeInTheDocument();
});

test("should render parent workflow name and link when there is workflow family", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const fakeParentWorkflow = { name: "Parent Workflow", id: 2120 };
  const fakeCurrentWorkflow = { name: fakeWorkflowName, id: fakeWorkflowId };
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [fakeParentWorkflow, fakeCurrentWorkflow]
      }
    },
    config: {}
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );
  expect(
    queryByText(fakeParentWorkflow.name).parentElement.href.includes(
      `/workflows/instances/${fakeParentWorkflow.id}`
    )
  ).not.toBe(false);
  expect(queryByText(fakeParentWorkflow.name)).toBeInTheDocument();
});

test("should render options menu", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {}
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText("more_vert")).toBeInTheDocument();
});

test("should render options menu with view comments and, print without any permissions", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {}
  });
  const { queryByText, queryAllByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/view comments/i)).toBeInTheDocument();
  expect(queryAllByText(/print/i).length).toBeGreaterThanOrEqual(1);
});

test("should render options menu with activity log option when user has permission", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {
      permissions: [Permissions.CAN_VIEW_ACTIVITY_LOG]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/view activity log/i)).toBeInTheDocument();
});

test("should render options menu with archive option when user has permission", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {
      permissions: [Permissions.CAN_ARCHIVE_WORKFLOW]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/archive workflow/i)).toBeInTheDocument();
});

test("should not render archive workflow option when user dont have permission", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/archive workflow/i)).toBeNull();
});

test("should not render view activiyt log option when user dont have permission", () => {
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    config: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/view activity log/i)).toBeNull();
});

test("should render status of the workflow when user has permission", () => {
  const fakeWorkflowStatus = "Workflow Status";
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        status: { label: fakeWorkflowStatus }
      }
    },
    config: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText(fakeWorkflowStatus)).toBeInTheDocument();
});

test("should render status of the workflow when user dont has permission", () => {
  const fakeWorkflowStatus = "Workflow Status";
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        status: { label: fakeWorkflowStatus }
      }
    },
    config: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText(fakeWorkflowStatus)).toBeNull();
});

test("should render exactly 3 lc data when user has permission", () => {
  const fakeLCData = [
    { label: "LC 1 label", value: "LC 1 value", display_type: "normal" },
    { label: "LC 2 label", value: "LC 2 value", display_type: "normal" },
    { label: "LC 3 label", value: "LC 3 value", display_type: "normal" },
    { label: "LC 4 label", value: "LC 4 value", display_type: "normal" }
  ];
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: fakeLCData
      }
    },
    config: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText(fakeLCData[0].value)).toBeInTheDocument();
  expect(queryByText(fakeLCData[1].value)).toBeInTheDocument();
  expect(queryByText(fakeLCData[2].value)).toBeInTheDocument();
  expect(queryByText(fakeLCData[3].value)).toBeNull();
});

test("should not render any lc data when user dont has permission", () => {
  const fakeLCData = [
    { label: "LC 1 label", value: "LC 1 value", display_type: "normal" },
    { label: "LC 2 label", value: "LC 2 value", display_type: "normal" },
    { label: "LC 3 label", value: "LC 3 value", display_type: "normal" },
    { label: "LC 4 label", value: "LC 4 value", display_type: "normal" }
  ];
  const rootReducer = combineReducers({ workflowDetailsHeader, config });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: fakeLCData
      }
    },
    config: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar workflowIdFromDetailsToSidebar={fakeWorkflowId} />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText(fakeLCData[0].value)).toBeNull();
  expect(queryByText(fakeLCData[1].value)).toBeNull();
  expect(queryByText(fakeLCData[2].value)).toBeNull();
  expect(queryByText(fakeLCData[3].value)).toBeNull();
});

test("should not render any LC data in modal, even though the user has permission", () => {
  const fakeLCData = [
    { label: "LC 1 label", value: "LC 1 value", display_type: "normal" },
    { label: "LC 2 label", value: "LC 2 value", display_type: "normal" },
    { label: "LC 3 label", value: "LC 3 value", display_type: "normal" },
    { label: "LC 4 label", value: "LC 4 value", display_type: "normal" }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    config
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: fakeLCData
      }
    },
    config: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar
          workflowIdFromDetailsToSidebar={fakeWorkflowId}
          minimalUI={true}
        />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText(fakeLCData[0].value)).toBeNull();
  expect(queryByText(fakeLCData[1].value)).toBeNull();
  expect(queryByText(fakeLCData[2].value)).toBeNull();
  expect(queryByText(fakeLCData[3].value)).toBeNull();
});
