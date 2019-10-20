import React from "react";
import { renderWithRedux } from "../../../common/utils/testUtils";
import WorkflowSorter from "../components/WorkflowSorter";
import { FetchMock, fetchMock } from "@react-mock/fetch";
import { fireEvent } from "@testing-library/react";
import {
  WORKLFOW_ASC_SORT_PARAM,
  WORKLFOW_DESC_SORT_PARAM,
  FILTERS_ENUM
} from "../../constants";

test("should not render anything if kind is not selected", () => {
  const { queryByText } = renderWithRedux(<WorkflowSorter />, {
    initialState: {
      workflowList: { selectedWorkflowFilters: {} }
    }
  });
  expect(queryByText(/sort/i)).toBeNull();
});

test("should not render anything if kind not selected but sorting is disabled", () => {
  const { queryByText } = renderWithRedux(<WorkflowSorter />, {
    initialState: {
      workflowList: {
        selectedWorkflowFilters: {
          [FILTERS_ENUM.KIND_FILTER.name]: {
            name: FILTERS_ENUM.KIND_FILTER.name,
            key: FILTERS_ENUM.KIND_FILTER.key,
            value: 1,
            meta: {
              is_sorting_field_enabled: false
            }
          }
        }
      }
    }
  });
  expect(queryByText(/sort/i)).toBeNull();
});

test("should render 'sort:risk' text when sorting is enabled", () => {
  const { queryByText } = renderWithRedux(<WorkflowSorter />, {
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

test("should call the api with asc order when sorting is clicked once and render proper sorting icon", () => {
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText, queryByTestId } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <WorkflowSorter />
    </FetchMock>,
    {
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
    }
  );
  const sortElement = queryByText(/sort/i);
  fireEvent.click(sortElement);

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const orderingParam = new URL(url).searchParams.get("ordering");
  expect(orderingParam).toBe(WORKLFOW_ASC_SORT_PARAM);
  expect(queryByTestId(/sorting-up/)).toBeInTheDocument();
});

test("should call the api with desc order when sorting is clicked twice and render proper sorting icon", () => {
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText, queryByTestId } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <WorkflowSorter />
    </FetchMock>,
    {
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
    }
  );

  // Click twice
  const sortElement = queryByText(/sort/i);
  fireEvent.click(sortElement);
  fireEvent.click(sortElement);

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const orderingParam = new URL(url).searchParams.get("ordering");
  expect(orderingParam).toBe(WORKLFOW_DESC_SORT_PARAM);
  expect(queryByTestId(/sorting-down/)).toBeInTheDocument();
});

test("should not call the api with sorting param when sorting is clicked thrice", () => {
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <WorkflowSorter />
    </FetchMock>,
    {
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
    }
  );

  // Click twice
  const sortElement = queryByText(/sort/i);
  fireEvent.click(sortElement);
  fireEvent.click(sortElement);
  fireEvent.click(sortElement);

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const orderingParam = new URL(url).searchParams.get("ordering");
  expect(orderingParam).toBe(null);
});

test("should not render any sorting icon initially", () => {
  const { queryByTestId } = renderWithRedux(<WorkflowSorter />, {
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

  expect(queryByTestId(/sorting-up/)).toBeNull();
  expect(queryByTestId(/sorting-down/)).toBeNull();
});
