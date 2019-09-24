import React from "react";
import WorkflowDetails from "../WorkflowDetails";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { workflowDetailsHeader } from "../../../../js/reducers/workflow_details_header";
import { workflowDetails } from "../../../../js/reducers/workflow_details";
import { permissions } from "../../../../modules/common/permissions/reducer";
import { renderWithReactIntl } from "../../../../modules/common/testUtils";
import { BrowserRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";
import Permissions from "../../../../modules/common/permissions/permissionsList";

// Fake Data
const fakeWorkflowId = 3120;
const fakeWorkflowName = "Current Workflow";

beforeEach(() => {
  // Removing the window.scroll not implemented warning
  window.scroll = () => {};
});

// Tests start here
test("should render current workflow name", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {}
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );
  expect(queryByText("Current Workflow")).toBeInTheDocument();
});

test("should render all workflows' name and link when from the workflow family", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const fakeParentWorkflow = { name: "Parent Workflow", id: 2120 };
  const fakeGranparentWorkflow = {
    name: "Fake Grand Parent Workflow",
    id: 1120
  };
  const fakeCurrentWorkflow = { name: fakeWorkflowName, id: fakeWorkflowId };
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [
          fakeGranparentWorkflow,
          fakeParentWorkflow,
          fakeCurrentWorkflow
        ]
      }
    },
    permissions: {}
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  // Parent
  expect(
    queryByText(fakeParentWorkflow.name).parentElement.href.includes(
      `/workflows/instances/${fakeParentWorkflow.id}`
    )
  ).not.toBe(false);
  expect(queryByText(fakeParentWorkflow.name)).toBeInTheDocument();

  // Grand Parent
  expect(
    queryByText(fakeGranparentWorkflow.name).parentElement.href.includes(
      `/workflows/instances/${fakeGranparentWorkflow.id}`
    )
  ).not.toBe(false);
  expect(queryByText(fakeGranparentWorkflow.name)).toBeInTheDocument();
});

test("should render options menu", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {}
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText("more_vert")).toBeInTheDocument();
});

test("should render options menu with view comments and, print without any permissions", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {}
  });
  const { queryByText, queryAllByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/view comments/i)).toBeInTheDocument();
  expect(queryAllByText(/print/i).length).toBeGreaterThanOrEqual(1);
});

test("should render options menu with activity log option when user has permission", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_ACTIVITY_LOG]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/view activity log/i)).toBeInTheDocument();
});

test("should render options menu with archive option when user has permission", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {
      permissions: [Permissions.CAN_ARCHIVE_WORKFLOWS]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/archive workflow/i)).toBeInTheDocument();
});

test("should not render archive workflow option when user dont have permission", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/archive workflow/i)).toBeNull();
});

test("should not render view activity log option when user dont have permission", () => {
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const optionsMenuNode = queryByText("more_vert");
  fireEvent.click(optionsMenuNode);

  expect(queryByText(/view activity log/i)).toBeNull();
});

test("should render status of the workflow when user has permission", () => {
  const fakeWorkflowStatus = "Workflow Status";
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        status: { label: fakeWorkflowStatus }
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  expect(queryByText(fakeWorkflowStatus)).toBeInTheDocument();
});

test("should render status of the workflow when user dont has permission", () => {
  const fakeWorkflowStatus = "Workflow Status";
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        status: { label: fakeWorkflowStatus }
      }
    },
    permissions: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
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
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: fakeLCData
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
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
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: fakeLCData
      }
    },
    permissions: {
      permissions: []
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
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
    permissions
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: fakeLCData
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
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

test("should render all the step group names", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 1 }]
    },
    {
      id: 2,
      definition: { name_en: "Group 2" },
      steps: [{ id: 2 }]
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );
  expect(queryByText(fakeStepGroups[0].definition.name_en)).toBeInTheDocument();
  expect(queryByText(fakeStepGroups[1].definition.name_en)).toBeInTheDocument();
});

test("should render completed step and total step count for every step group", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        { id: 2, completed_by: "Rajat" },
        { id: 3, completed_by: "Rajat" },
        { id: 4, completed_by: null },
        { id: 5, completed_by: null }
      ]
    },
    {
      id: 10,
      definition: { name_en: "Group 2" },
      steps: [{ id: 20, completed_by: null }]
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  // 2 completed out of 4
  expect(queryByText(/2\/4/i)).toBeInTheDocument();

  // 0 completed out of 1
  expect(queryByText(/0\/1/i)).toBeInTheDocument();
});

test("should render check circle icon when all the steps are completed", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        { id: 2, completed_by: "Rajat" },
        { id: 3, completed_by: "Rajat" }
      ]
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  expect(queryByText(/check_circle/i)).toBeInTheDocument();
});

test("should render alarm icon when step group is overdue and atleast one step is incomplete", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat" }, { id: 3, completed_by: null }],
      overdue: true
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  expect(queryByText(/alarm/i)).toBeInTheDocument();
});

test("should render panorama fish eye icon when step group is not overdue and atleast one step is incomplete", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat" }, { id: 3, completed_by: null }],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  expect(queryByText(/panorama_fish_eye/i)).toBeInTheDocument();
});

test("should render all the steps for the active step group", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        { id: 2, completed_by: "Rajat", name: "Step 1" },
        { id: 3, completed_by: null, name: "Step 2" }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  fireEvent.click(queryByText(fakeStepGroups[0].definition.name_en));

  expect(queryByText(fakeStepGroups[0].steps[0].name)).toBeInTheDocument();
  expect(queryByText(fakeStepGroups[0].steps[1].name)).toBeInTheDocument();
});

test("should render check circle icon when the step is completed", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat", name: "Step 1" }],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryAllByText, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryAllByText(/check_circle/i).length).toBeGreaterThanOrEqual(1);
});

test("should render alarm icon when the step is overdue and incomplete", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: true }],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryAllByText, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryAllByText(/alarm/i).length).toBeGreaterThanOrEqual(1);
});

test("should render lens icon when the step is not overdue, incomplete and selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 49, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryAllByText, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );
  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  const stepElement = queryByText(fakeStepGroups[0].steps[0].name);
  fireEvent.click(stepElement);
  expect(queryAllByText(/lens/i).length).toBeGreaterThanOrEqual(1);
});

test("should render panoram fish icon when the step is not overdue, incomplete and not selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });
  const { queryAllByText, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryAllByText(/panorama_fish_eye/i).length).toBeGreaterThanOrEqual(1);
});

test("should render the selected step with proper styling", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];

  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  const stepElement = queryByText(fakeStepGroups[0].steps[0].name);
  fireEvent.click(stepElement);

  const style = window.getComputedStyle(stepElement.parentElement);
  expect(style.backgroundColor).not.toBe("none");
});

test("should render Locked icon on locked steps if the step is accessible", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          is_locked: true,
          dependent_steps: [{ value: 100, label: "Dependent Step" }]
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 2",
          alerts: [],
          is_locked: false
        }
      ],
      overdue: false
    },
    {
      id: 4,
      definition: { name_en: "Group 2" },
      steps: [
        {
          id: 5,
          completed_by: null,
          name: "Dependent Step",
          alerts: [],
          is_locked: false,
          definition: 100
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByText, queryAllByTestId } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryAllByTestId(/step-locked-icon/i).length).toBe(1);
});

test("should not render Locked step if the step is inaccessible", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          is_locked: true,
          dependent_steps: [{ value: 100, label: "Dependent Step" }]
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 2",
          alerts: [],
          is_locked: false
        }
      ],
      overdue: false
    },
    {
      id: 4,
      definition: { name_en: "Group 2" },
      steps: [
        {
          id: 5,
          completed_by: null,
          name: "Step 3",
          alerts: [],
          is_locked: true,
          dependent_steps: [{ value: 100, label: "Dependent Step" }]
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 4",
          alerts: [],
          is_locked: true,
          dependent_steps: [{ value: 100, label: "Dependent Step" }]
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByText, queryAllByText, queryAllByTestId } = renderWithReactIntl(
    <Provider store={store}>
      <BrowserRouter>
        <WorkflowDetails
          workflowIdFromPropsForModal={fakeWorkflowId}
          hideStepBody={true}
          dispatch={() => {}}
        />
      </BrowserRouter>
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryAllByTestId(/step-locked-icon/i).length).toBe(0);
  expect(queryAllByText(/step/i).length).toBe(1);

  // since the 2nd step group has dependent steps are are inaccessible
  // that group itself should never appear.
  expect(queryAllByText(/group/i).length).toBe(1);
});

test("should render alerts count on stepgroup when there is atleast one alert", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 1 }],
      overdue: false,
      alerts: [
        {
          alert: {
            category: {
              color_label: "#ffffff"
            }
          }
        }
      ]
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: [{ value: "Some value", display_type: "normal" }]
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    },
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  // For some reason first stepgroup is auto selected, selecting profile to de select that
  // since alerts are not shown on selected step group
  const profileElement = queryByText(/profile/i);
  fireEvent.click(profileElement);

  expect(queryByTestId(/colored-count/i).innerHTML).toBe("1");
});

test("should not render alerts count on stepgroup when there are no alerts", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [],
      overdue: false,
      alerts: []
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: [{ value: "Some value", display_type: "normal" }]
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    },
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  // For some reason first stepgroup is auto selected, selecting profile to de select that
  // since alerts are not shown on selected step group
  const profileElement = queryByText(/profile/i);
  fireEvent.click(profileElement);

  expect(queryByTestId(/colored-count/i)).toBeNull();
});

test("should not render alerts count on stepgroup when when group is selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 1 }],
      overdue: false,
      alerts: [
        {
          alert: {
            category: {
              color_label: "#ffffff"
            }
          }
        }
      ]
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryByTestId(/colored-count/i)).toBeNull();
});

test("should render alerts count on step when there is atleast one alert", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [
            {
              alert: {
                category: {
                  color_label: "#ffffff"
                }
              }
            }
          ]
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryByTestId(/colored-count/i).innerHTML).toBe("1");
});

test("should not render alerts count on step when there are no alerts", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: []
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  const groupElement = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(groupElement);

  expect(queryByTestId(/colored-count/i)).toBeNull();
});

test("should not display profile if the lc_data is empty, instead first step should be selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: []
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: []
      }
    },
    permissions: {},

    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  expect(queryByTestId(/profile-step/i)).toBeNull();
});

test("should not display profile if the lc_data is NOT empty but user doesn't have permission to view profile data, first step should be selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: []
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: [{ value: "Some value", display_type: "normal" }]
      }
    },
    permissions: {},

    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
      />
    </Provider>
  );

  expect(queryByTestId(/profile-step/i)).toBeNull();
});

test("should display profile and should be selected, if the lc_data is not empty", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: []
        }
      ],
      overdue: false
    }
  ];
  const rootReducer = combineReducers({
    workflowDetailsHeader,
    permissions,
    workflowDetails
  });
  const store = createStore(rootReducer, {
    workflowDetailsHeader: {
      [fakeWorkflowId]: {
        name: fakeWorkflowName,
        workflow_family: [],
        lc_data: [{ value: "Some value", display_type: "normal" }]
      }
    },
    permissions: {
      permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
    },
    workflowDetails: {
      [fakeWorkflowId]: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    }
  });

  const { queryByTestId } = renderWithReactIntl(
    <Provider store={store}>
      <WorkflowDetails
        workflowIdFromPropsForModal={fakeWorkflowId}
        hideStepBody={true}
        dispatch={() => {}}
        minimalUI={true}
      />
    </Provider>
  );

  const profileStep = queryByTestId(/profile-step/i);

  expect(profileStep).not.toBeNull();
});

// test("should not display any inaccessible steps", async () => {
//   const fakeStepGroups = [
//     {
//       id: 1,
//       definition: { name_en: "Group 1" },
//       steps: [
//         {
//           id: 2,
//           completed_by: null,
//           name: "Step 1",
//           alerts: [],
//           is_locked: false,
//           definition: 2
//         },
//         {
//           id: 3,
//           completed_by: null,
//           name: "Step 2",
//           alerts: [],
//           is_locked: false,
//           definition: 3
//         }
//       ],
//       overdue: false
//     },
//     {
//       id: 4,
//       definition: { name_en: "Group 2" },
//       steps: [
//         {
//           id: 5,
//           completed_by: null,
//           name: "Step 3",
//           alerts: [],
//           is_locked: true,
//           definition: 5,
//           dependent_steps: [{ value: 100, label: "Unavailable dependent step" }]
//         },
//         {
//           id: 6,
//           completed_by: null,
//           name: "Step 4",
//           alerts: [],
//           is_locked: true,
//           definition: 6,
//           dependent_steps: [{ value: 2, label: "Step 1" }]
//         }
//       ],
//       overdue: false
//     },
//     {
//       id: 7,
//       definition: { name_en: "Group 3" },
//       steps: [
//         {
//           id: 8,
//           completed_by: null,
//           name: "Step 5",
//           alerts: [],
//           is_locked: true,
//           definition: 8,
//           dependent_steps: [{ value: 2, label: "Step 1" }]
//         },
//         {
//           id: 9,
//           completed_by: null,
//           name: "Step 6",
//           alerts: [],
//           is_locked: true,
//           definition: 9,
//           dependent_steps: [
//             { value: 2, label: "Step 1" },
//             { value: 3, label: "Step 2" }
//           ]
//         }
//       ],
//       overdue: false
//     },
//     {
//       id: 10,
//       definition: { name_en: "Group 4" },
//       steps: [
//         {
//           id: 11,
//           completed_by: null,
//           name: "Step 7",
//           alerts: [],
//           is_locked: true,
//           definition: 11,
//           dependent_steps: [{ value: 100, label: "Unavailable dependent step" }]
//         },
//         {
//           id: 12,
//           completed_by: null,
//           name: "Step 8",
//           alerts: [],
//           is_locked: true,
//           definition: 12,
//           dependent_steps: [
//             { value: 100, label: "Unavailable dependent step" },
//             { value: 3, label: "Step 2" }
//           ]
//         }
//       ],
//       overdue: false
//     }
//   ];
//   const rootReducer = combineReducers({
//     workflowDetailsHeader,
//     permissions,
//     workflowDetails
//   });
//   const store = createStore(rootReducer, {
//     workflowDetailsHeader: {
//       [fakeWorkflowId]: {
//         name: fakeWorkflowName,
//         workflow_family: [],
//         lc_data: [{ value: "Some value", display_type: "normal" }]
//       }
//     },
//     currentStepFields: {
//       2: { currentStepFields: [{}] },
//       3: { currentStepFields: [{}] },
//       5: { currentStepFields: [{}] },
//       6: { currentStepFields: [{}] },
//       8: { currentStepFields: [{}] },
//       9: { currentStepFields: [{}] },
//       11: { currentStepFields: [{}] },
//       12: { currentStepFields: [{}] }
//     },
//     permissions: {
//       permissions: [Permissions.CAN_VIEW_WORKFLOW_PROFILE]
//     },

//     workflowDetails: {
//       [fakeWorkflowId]: {
//         workflowDetails: {
//           stepGroups: {
//             results: fakeStepGroups
//           }
//         }
//       }
//     }
//   });

//   const { queryByText, queryAllByText } = renderWithReactIntl(
//     <Provider store={store}>
//       <WorkflowDetails
//         workflowIdFromPropsForModal={fakeWorkflowId}
//         dispatch={() => {}}
//       />
//     </Provider>
//   );

//   const Group1 = queryByText("Group 1");
//   const Group2 = queryByText("Group 2");
//   const Group3 = queryByText("Group 3");
//   const Group4 = queryByText("Group 4");
//   fireEvent.click(Group1);

//   expect(Group1).toBeInTheDocument();
//   expect(Group2).toBeInTheDocument();
//   expect(Group3).toBeInTheDocument();
//   expect(Group4).not.toBeInTheDocument();

//   expect(queryAllByText("Step 1").length).toBeGreaterThanOrEqual(2);
//   expect(queryAllByText("Step 2").length).toBeGreaterThanOrEqual(2);

//   fireEvent.click(Group2);
//   expect(queryAllByText("Step 3").length).toBe(0);
//   expect(queryAllByText("Step 4").length).toBeGreaterThanOrEqual(2);

//   fireEvent.click(Group3);
//   expect(queryAllByText("Step 4").length).toBeGreaterThanOrEqual(2);
//   expect(queryAllByText("Step 5").length).toBeGreaterThanOrEqual(2);

//   expect(queryByText("Step 7")).not.toBeInTheDocument();
//   expect(queryByText("Step 8")).not.toBeInTheDocument();
// });
