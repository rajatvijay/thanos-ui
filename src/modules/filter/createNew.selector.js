import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";

const getWorkflowKinds = state =>
  lodashGet(state.workflowKind, "workflowKind", []) || [];

/**
 * Using reselect we're creating a reusable selector for filtering the
 * Workflow Kinds that should not be created by the user by crosschecking
 * their tags from fixed ones, and those from the config.
 *
 * @param {object} state Redux State
 * @returns {Array} Filtered Workflow Kinds' array that should be visible.
 */
export const getVisibleWorkflowKinds = createSelector(
  getWorkflowKinds,
  (kinds, hiddenTags) => {
    // If we have no kinds, return an empty array.
    if (!kinds.length) return [];

    // List of workflow tags that shouldn't appear on the create menu.
    const privateWorkflows = ["users", "entity-id"];

    return kinds.filter(
      kind =>
        !kind.is_related_kind &&
        kind.features.includes("add_workflow") &&
        !privateWorkflows.includes(kind.tag)
    );
  }
);
