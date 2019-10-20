import React from "react";
import { renderWithRedux } from "../../../common/utils/testUtils";
import WorkflowToolbar from "../components/WorkflowToolbar";
import { fireEvent } from "@testing-library/react";
import { FILTERS_ENUM } from "../../constants";

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
          [FILTERS_ENUM.KIND_FILTER.name]: {
            name: FILTERS_ENUM.KIND_FILTER.name,
            key: FILTERS_ENUM.KIND_FILTER.key,
            value: 1,
            meta: {
              is_sorting_field_enabled: true
            }
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
          [FILTERS_ENUM.STATUS_FILTER.name]: {
            name: FILTERS_ENUM.STATUS_FILTER.name,
            key: FILTERS_ENUM.STATUS_FILTER.key,
            value: "Fake Selected Status",
            meta: {
              label: "Fake Selected Status Label",
              value: "Fake Selected Status"
            }
          },
          [FILTERS_ENUM.REGION_FILTER.name]: {
            name: FILTERS_ENUM.REGION_FILTER.name,
            key: FILTERS_ENUM.REGION_FILTER.key,
            value: "Fake Selected Region",
            meta: {
              label: "Fake Selected Region Label",
              value: "Fake Selected Region"
            }
          },
          [FILTERS_ENUM.BUSINESS_UNIT_FILTER.name]: {
            name: FILTERS_ENUM.BUSINESS_UNIT_FILTER.name,
            key: FILTERS_ENUM.BUSINESS_UNIT_FILTER.key,
            value: "Fake Selected Business",
            meta: {
              label: "Fake Selected Business Label",
              value: "Fake Selected Business"
            }
          }
        }
      }
    }
  });
  expect(queryByText(/Fake Selected Status Label/i)).toBeInTheDocument();
  expect(queryByText(/Fake Selected Region Label/i)).toBeInTheDocument();
  expect(queryByText(/Fake Selected Business Label/i)).toBeInTheDocument();
});
