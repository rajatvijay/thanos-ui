import React from "react";
import { waitForDomChange } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import CreateNew from "../components/CreateNew";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { workflowKind } from "../../../js/reducers/workflow_kind";
import { config } from "../../../js/reducers/config";
import { renderWithReactIntl } from "../../common/testUtils";

test("should not return any of the workflow kinds that are specifically child-workflow kinds or those that don't allow 'add_workflow' as feature.", async () => {
  const state = {
    workflowKind: {
      workflowKind: [
        {
          id: 1,
          is_related_kind: false,
          tag: "kind-1",
          name: "Kind 1",
          features: []
        },
        {
          id: 2,
          is_related_kind: false,
          tag: "kind-2",
          name: "Kind 2",
          features: []
        },
        {
          id: 3,
          is_related_kind: true,
          tag: "kind-3",
          name: "Kind 3",
          features: ["add_workflow"]
        },
        {
          id: 4,
          is_related_kind: false,
          tag: "kind-4",
          name: "Kind 4",
          features: ["add_workflow"]
        },
        {
          id: 5,
          is_related_kind: false,
          tag: "users",
          name: "Users",
          features: ["add_workflow"]
        },
        {
          id: 6,
          is_related_kind: false,
          tag: "entity-id",
          name: "Entity ID",
          features: ["add_workflow"]
        }
      ]
    }
  };

  const rootReducer = combineReducers({
    workflowKind,
    config
  });
  const store = createStore(rootReducer, state);

  const { queryByTestId, queryByText } = renderWithReactIntl(
    <Provider store={store}>
      <CreateNew dispatch={jest.fn} />
    </Provider>
  );
  fireEvent.mouseOver(queryByTestId("create-main-workflow"));

  // Wait for list to show up
  await waitForDomChange();

  const kind1 = queryByText(/kind 1/i);
  const kind2 = queryByText(/kind 2/i);
  const kind3 = queryByText(/kind 3/i);
  const kind4 = queryByText(/kind 4/i);
  const kind5 = queryByText(/users/i);
  const kind6 = queryByText(/entity id/i);

  expect(kind1).toBe(null);
  expect(kind2).toBe(null);
  expect(kind3).toBe(null);
  expect(kind4).toBeInTheDocument();
  expect(kind5).toBe(null);
  expect(kind6).toBe(null);
});
