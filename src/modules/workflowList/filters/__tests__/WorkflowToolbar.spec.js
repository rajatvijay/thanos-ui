import React from "react";
import { renderWithRedux } from "../../../common/utils/testUtils";
import WorkflowToolbar from "../components/WorkflowToolbar";
import { fireEvent } from "@testing-library/react";
import {
  STATUS_FILTER_NAME,
  REGION_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME
} from "../../constants";

test("should render workflow count", () => {
  const { queryByText } = renderWithRedux(<WorkflowToolbar />, {
    initialState: {
      workflowList: {
        workflowList: {
          data: {
            results: [1, 2, 3, 4, 5, 6]
          }
        }
      }
    }
  });
  expect(queryByText(/6 results/i)).toBeInTheDocument();
});

test("should not render workflow count", () => {
  const { queryByText } = renderWithRedux(<WorkflowToolbar />);
  expect(queryByText(/results/i)).toBeNull();
});

test("should render sorter when sorting is enabled", () => {
  const { queryByText } = renderWithRedux(<WorkflowToolbar />, {
    initialState: {
      workflowList: {
        selectedWorkflowFilters: {
          kind: {
            is_sorting_field_enabled: true
          }
        }
      }
    }
  });
  expect(queryByText(/sort/i)).toBeInTheDocument();
  expect(queryByText(/risk/i)).toBeInTheDocument();
});

test("should render filter trigger and clicking it opens the filter menu", () => {
  const { queryByText } = renderWithRedux(<WorkflowToolbar />);
  fireEvent.click(queryByText(/filter/i));
  expect(queryByText(/advanced filter/i)).toBeInTheDocument();
});

test("should close the filter menu when clicked twice", () => {
  const { queryByText } = renderWithRedux(<WorkflowToolbar />);
  const triggerNode = queryByText(/filter/i);
  fireEvent.click(triggerNode);
  expect(queryByText(/advanced filter/i)).toBeInTheDocument();
  fireEvent.click(triggerNode);
  expect(queryByText(/advanced filter/i)).toBeNull();
});

test("should render + icon to create new workflow", () => {
  const fakeKinds = [
    { id: 1, name_en: "Fake Kind 1", features: ["add_workflow"] }
  ];
  const { queryByTestId } = renderWithRedux(<WorkflowToolbar />, {
    initialState: {
      workflowList: {
        kinds: {
          isLoading: false,
          data: {
            results: fakeKinds
          }
        }
      }
    }
  });
  expect(queryByTestId("plus-icon")).toBeInTheDocument();
});

test("should render all the selected basic filters", () => {
  const { queryByText } = renderWithRedux(<WorkflowToolbar />, {
    initialState: {
      workflowList: {
        selectedWorkflowFilters: {
          [STATUS_FILTER_NAME]: {
            label: "Fake Selected Status Label",
            value: "Fake Selected Status"
          },
          [REGION_FILTER_NAME]: {
            label: "Fake Selected Region Label",
            value: "Fake Selected Region"
          },
          [BUSINESS_UNIT_FILTER_NAME]: {
            label: "Fake Selected Business Label",
            value: "Fake Selected Business"
          }
        }
      }
    }
  });
  expect(queryByText(/Fake Selected Status Label/i)).toBeInTheDocument();
  expect(queryByText(/Fake Selected Region Label/i)).toBeInTheDocument();
  expect(queryByText(/Fake Selected Business Label/i)).toBeInTheDocument();
});
