import React from "react";
import KindDropdown from "../components/KindDropdown";
import { renderWithRedux } from "../../../common/utils/testUtils";
import { fireEvent } from "@testing-library/react";
import { FetchMock, fetchMock } from "@react-mock/fetch";
import { KIND_FILTER_NAME, FIELD_ANSWER_PARAM } from "../../constants";

test("should render loader when kinds are loading", () => {
  const { queryByTestId } = renderWithRedux(<KindDropdown />, {
    initialState: {
      workflowList: {
        kinds: {
          isLoading: true
        }
      }
    }
  });
  expect(queryByTestId(/kind-dropdown-loader/i)).toBeInTheDocument();
});

test("should render selected kind and field answer tag with check icon", () => {
  const fakeKinds = [
    {
      id: 1,
      name: "fake kind 1",
      field_tags_for_filter: [
        {
          extra_en: [{ label: "fake field tag 1" }]
        }
      ]
    }
  ];
  const { queryByText, queryByTestId, container } = renderWithRedux(
    <KindDropdown />,
    {
      initialState: {
        workflowList: {
          kinds: {
            data: {
              results: fakeKinds
            }
          },
          selectedWorkflowFilters: {
            kind: fakeKinds[0],
            answer: {
              fieldAnswer: fakeKinds[0].field_tags_for_filter[0].extra_en[0]
            }
          }
        }
      }
    }
  );

  expect(queryByText(fakeKinds[0].name)).toBeInTheDocument();
  expect(
    queryByText(fakeKinds[0].field_tags_for_filter[0].extra_en[0].label)
  ).toBeInTheDocument();

  // Open the dropdown
  const dropdownNode = container.querySelector(".ant-dropdown-trigger");
  fireEvent.click(dropdownNode);
  expect(queryByTestId(/kinds-dropdonw-check-icon/)).toBeInTheDocument();
});

test("should render all the kind and field answer tags", () => {
  const fakeKinds = [
    {
      id: 1,
      name: "fake kind 1",
      field_tags_for_filter: [
        {
          extra_en: [{ label: "fake field tag 1" }]
        }
      ]
    },
    {
      id: 2,
      name: "fake kind 2",
      field_tags_for_filter: [
        {
          extra_en: [{ label: "fake field tag 2" }]
        }
      ]
    }
  ];
  const { queryByText, container } = renderWithRedux(<KindDropdown />, {
    initialState: {
      workflowList: {
        kinds: {
          data: {
            results: fakeKinds
          }
        }
      }
    }
  });

  const dropdownNode = container.querySelector(".ant-dropdown-trigger");
  fireEvent.click(dropdownNode);

  expect(queryByText(fakeKinds[0].name)).toBeInTheDocument();
  expect(queryByText(fakeKinds[1].name)).toBeInTheDocument();

  expect(
    queryByText(fakeKinds[0].field_tags_for_filter[0].extra_en[0].label)
  ).toBeInTheDocument();
  expect(
    queryByText(fakeKinds[1].field_tags_for_filter[0].extra_en[0].label)
  ).toBeInTheDocument();
});

test("should render selected kind and field answer tag with check icon", () => {
  const fakeKinds = [
    {
      id: 1,
      name: "fake kind 1",
      field_tags_for_filter: [
        {
          extra_en: [{ label: "fake field tag 1" }]
        }
      ]
    }
  ];
  const { queryByText, queryByTestId, container } = renderWithRedux(
    <KindDropdown />,
    {
      initialState: {
        workflowList: {
          kinds: {
            data: {
              results: fakeKinds
            }
          },
          selectedWorkflowFilters: {
            kind: fakeKinds[0]
          }
        }
      }
    }
  );

  expect(queryByText(fakeKinds[0].name)).toBeInTheDocument();

  // Open the dropdown
  const dropdownNode = container.querySelector(".ant-dropdown-trigger");
  fireEvent.click(dropdownNode);
  expect(queryByTestId(/kinds-dropdonw-check-icon/)).toBeInTheDocument();
});

test("should call the workflow list api with selected kind when kind is selected", () => {
  const fakeKind = {
    id: 1,
    name: "fake kind 1",
    tag: "kindTag",
    field_tags_for_filter: [
      {
        extra_en: [{ label: "fake field tag 1" }]
      }
    ]
  };
  const WORKFLOW_LIST_API_URL = "path:/api/v1/workflows-list/";
  const TASK_QUEUES_API_URL = `path:/api/v1/workflow-kinds/${fakeKind.tag}/count/`;
  const ALERTS_API_URL = `path:/api/v1/workflow-kinds/${fakeKind.tag}/alert-count`;
  const ADVANCED_FILTERS_API_URL = `path:/api/v1/fields/export-json/`;
  const { queryByText, container } = renderWithRedux(
    <FetchMock
      mocks={[
        { matcher: WORKFLOW_LIST_API_URL, method: "GET", response: 200 },
        { matcher: TASK_QUEUES_API_URL, method: "GET", response: 200 },
        { matcher: ALERTS_API_URL, method: "GET", response: 200 },
        { matcher: ADVANCED_FILTERS_API_URL, method: "GET", response: 200 }
      ]}
    >
      <KindDropdown />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          kinds: {
            data: {
              results: [fakeKind]
            }
          }
        }
      }
    }
  );

  // Opening the menu
  const dropdownNode = container.querySelector(".ant-dropdown-trigger");
  fireEvent.click(dropdownNode);

  // Selecting the kind
  fireEvent.click(queryByText(fakeKind.name));

  {
    const [url] = fetchMock.lastCall(WORKFLOW_LIST_API_URL, "GET");
    const kindParam = new URL(url).searchParams.get(KIND_FILTER_NAME);
    expect(Number(kindParam)).toBe(fakeKind.id);
  }

  {
    const [url] = fetchMock.lastCall(ADVANCED_FILTERS_API_URL, "GET");
    const kindParam = new URL(url).searchParams.get("active_kind");
    expect(kindParam).toBe(fakeKind.tag);
  }

  {
    const [url] = fetchMock.lastCall(TASK_QUEUES_API_URL, "GET");
    const kindParam = new URL(url).searchParams.get("type");
    expect(kindParam).toBe("stepgroup");
  }

  expect(fetchMock.called(ALERTS_API_URL, "GET")).toBe(true);
});

test("should call the workflow list api with selected kind and field tag when field tag is selected", () => {
  const fakeKind = {
    id: 1,
    name: "fake kind 1",
    tag: "kindTag",
    field_tags_for_filter: [
      {
        tag: "fieldTag",
        extra_en: [{ label: "fake field tag 1", value: "fieldValue" }]
      }
    ]
  };
  const WORKFLOW_LIST_API_URL = "path:/api/v1/workflows-list/";
  const TASK_QUEUES_API_URL = `path:/api/v1/workflow-kinds/${fakeKind.tag}/count/`;
  const ALERTS_API_URL = `path:/api/v1/workflow-kinds/${fakeKind.tag}/alert-count`;
  const ADVANCED_FILTERS_API_URL = `path:/api/v1/fields/export-json/`;
  const { queryByText, container } = renderWithRedux(
    <FetchMock
      mocks={[
        { matcher: WORKFLOW_LIST_API_URL, method: "GET", response: 200 },
        { matcher: TASK_QUEUES_API_URL, method: "GET", response: 200 },
        { matcher: ALERTS_API_URL, method: "GET", response: 200 },
        { matcher: ADVANCED_FILTERS_API_URL, method: "GET", response: 200 }
      ]}
    >
      <KindDropdown />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          kinds: {
            data: {
              results: [fakeKind]
            }
          }
        }
      }
    }
  );

  // Opening the menu
  const dropdownNode = container.querySelector(".ant-dropdown-trigger");
  fireEvent.click(dropdownNode);

  // Selecting the kind
  fireEvent.click(
    queryByText(fakeKind.field_tags_for_filter[0].extra_en[0].label)
  );

  {
    const [url] = fetchMock.lastCall(WORKFLOW_LIST_API_URL, "GET");
    const kindParam = new URL(url).searchParams.get(KIND_FILTER_NAME);
    expect(Number(kindParam)).toBe(fakeKind.id);

    const fieldAnswerParam = new URL(url).searchParams.get(FIELD_ANSWER_PARAM);
    expect(fieldAnswerParam).toBe(
      `${fakeKind.field_tags_for_filter[0].tag}__eq__${fakeKind.field_tags_for_filter[0].extra_en[0].value}`
    );
  }

  {
    const [url] = fetchMock.lastCall(ADVANCED_FILTERS_API_URL, "GET");
    const kindParam = new URL(url).searchParams.get("active_kind");
    expect(kindParam).toBe(fakeKind.tag);
  }

  {
    const [url] = fetchMock.lastCall(TASK_QUEUES_API_URL, "GET");
    const kindParam = new URL(url).searchParams.get("type");
    expect(kindParam).toBe("stepgroup");
  }

  expect(fetchMock.called(ALERTS_API_URL, "GET")).toBe(true);
});
