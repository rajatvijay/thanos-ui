import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";

const getMainNavStepGroups = state =>
  lodashGet(state.workflowGroupCount, "stepgroupdef_counts", []);

const getHiddenTags = state =>
  lodashGet(
    state.config,
    `custom_ui_labels["workflows.hiddenGroupsMainNav"]`,
    []
  );

/**
 * Using reselect we're creating a reusable selector for filtering the
 * Task Queue Workflow Groups that we need to hide, as given in
 * the config.
 *
 * @param {object} state Redux State
 * @returns {Array} Filtered Workflow Groups' array that should be visible.
 */
export const getVisibleWorkflowGroups = createSelector(
  getMainNavStepGroups,
  getHiddenTags,
  (groups, hiddenTags) => {
    if (Array.isArray(hiddenTags))
      return groups.filter(group => !hiddenTags.includes(group.tag));
    else return groups;
  }
);
