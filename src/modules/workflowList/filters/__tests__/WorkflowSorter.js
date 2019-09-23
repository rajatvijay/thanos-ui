import React from "react";
import { renderWithRedux } from "../../../common/utils/testUtils";
import WorkflowSorter from "../components/WorkflowSorter";

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
          kind: {
            is_sorting_field_enabled: false
          }
        }
      }
    }
  });
  expect(queryByText(/sort/i)).toBeNull();
});
