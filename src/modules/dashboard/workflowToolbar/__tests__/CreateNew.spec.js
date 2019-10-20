import React from "react";
import { renderWithRedux } from "../../../common/utils/testUtils";
import { fireEvent } from "@testing-library/react";
import CreateNew from "../components/CreateNew";
import { FetchMock, fetchMock } from "@react-mock/fetch";

const PLUS_ICON_TEST_ID = "plus-icon";

test("should render loading icon when kinds are being loaded", () => {
  const { container } = renderWithRedux(<CreateNew />, {
    initialState: {
      workflowList: {
        kinds: {
          isLoading: true
        }
      }
    }
  });

  const loadingIconNode = container.querySelector(".anticon-loading");

  expect(loadingIconNode).not.toBeNull();
});

test("should render plus icon when kinds are loaded", () => {
  const fakeKinds = [
    { id: 1, name_en: "Fake Kind 1", features: ["add_workflow"] }
  ];

  const { queryByTestId } = renderWithRedux(<CreateNew />, {
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

  expect(queryByTestId(PLUS_ICON_TEST_ID)).toBeInTheDocument();
});

test("should render all the kinds when the menu is opened", () => {
  const fakeKinds = [
    { id: 1, name_en: "Fake Kind 1", features: ["add_workflow"] },
    { id: 2, name_en: "Fake Kind 2", features: ["add_workflow"] }
  ];

  const { queryByTestId, queryByText } = renderWithRedux(<CreateNew />, {
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

  fireEvent.click(queryByTestId(PLUS_ICON_TEST_ID));

  expect(queryByText(fakeKinds[0].name_en)).toBeInTheDocument();
  expect(queryByText(fakeKinds[1].name_en)).toBeInTheDocument();
});

test("should not render kinds without add workflow permission", () => {
  const fakeKinds = [
    { id: 1, name_en: "Fake Kind 1", features: ["add_workflow"] },
    { id: 2, name_en: "Fake Kind 2", features: [] }
  ];

  const { queryByTestId, queryByText } = renderWithRedux(<CreateNew />, {
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

  fireEvent.click(queryByTestId(PLUS_ICON_TEST_ID));

  expect(queryByText(fakeKinds[0].name_en)).toBeInTheDocument();
  expect(queryByText(fakeKinds[1].name_en)).toBeNull();
});

test("should not render related kinds ", () => {
  const fakeKinds = [
    { id: 1, name_en: "Fake Kind 1", features: ["add_workflow"] },
    {
      id: 2,
      name_en: "Fake Kind 2",
      features: ["add_workflow"],
      is_related_kind: true
    }
  ];

  const { queryByTestId, queryByText } = renderWithRedux(<CreateNew />, {
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

  fireEvent.click(queryByTestId(PLUS_ICON_TEST_ID));

  expect(queryByText(fakeKinds[0].name_en)).toBeInTheDocument();
  expect(queryByText(fakeKinds[1].name_en)).toBeNull();
});

test("should not render kinds with tag entity-id and users", () => {
  const fakeKinds = [
    { id: 1, name_en: "Fake Kind 1", features: ["add_workflow"] },
    {
      id: 2,
      name_en: "Fake Kind 2",
      features: ["add_workflow"],
      is_related_kind: false,
      tag: "entity-id"
    },
    {
      id: 3,
      name_en: "Fake Kind 2",
      features: ["add_workflow"],
      is_related_kind: false,
      tag: "users"
    }
  ];

  const { queryByTestId, queryByText } = renderWithRedux(<CreateNew />, {
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

  fireEvent.click(queryByTestId(PLUS_ICON_TEST_ID));

  expect(queryByText(fakeKinds[0].name_en)).toBeInTheDocument();
  expect(queryByText(fakeKinds[1].name_en)).toBeNull();
  expect(queryByText(fakeKinds[2].name_en)).toBeNull();
});

test("should call the create workflow API when a kind a clicked", () => {
  const fakeKind = {
    id: 1,
    name_en: "Fake Kind 1",
    features: ["add_workflow"],
    default_status: "fake default status",
    tag: "fake tag"
  };
  // TODO: constraining that the source code and test use the same url
  const API_URL = "path:/api/v1/workflows/";
  const { queryByTestId, queryByText } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "POST", response: 200 }]}>
      <CreateNew />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          kinds: {
            isLoading: false,
            data: {
              results: [fakeKind]
            }
          }
        }
      }
    }
  );

  // Open the kind menu
  fireEvent.click(queryByTestId(PLUS_ICON_TEST_ID));

  // Click on kind
  const kindNode = queryByText(fakeKind.name_en);
  fireEvent.click(kindNode);

  const [, { body }] = fetchMock.lastCall(API_URL, "POST");
  expect(JSON.parse(body)).toEqual({
    status: fakeKind.default_status,
    kind: fakeKind.tag,
    name: "Draft"
  });
});

test.todo(
  "should not return any of the workflow kinds that are specifically child-workflow kinds or those that don't allow 'add_workflow' as feature."
);
