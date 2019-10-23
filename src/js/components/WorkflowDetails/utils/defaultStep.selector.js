/**
 * Default Step selector's responsibilities :
 * 1. Filter out inaccessible step tags
 * 2. Sequentually fill step-details for default_step_tags
 * 3. Iterate through steps and:
 *      a. Go through steps, and find the first incomplete step, return it
 *      b. Otherwise return the last one from that array.
 * 4. Return values should be in format of {groupId, stepId),
 *    Otherwise, return null for any other case
 */

import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";
import { getFilteredStepGroups } from "../../../../modules/workflows/sidebar/sidebar.selectors";

/**
 * Returns the detaul_step_tags key for the given workflowId, from
 * the provided (redux) state
 * @param {object} state given state (redux)
 * @param {number} workflowId workflow ID
 * @returns {Array|null} default_step_tags
 */
const getDefaultStepTags = (state, workflowId) =>
  lodashGet(
    state.workflowDetailsHeader,
    `[${workflowId}].definition.default_step_tags`,
    null
  );

/**
 * To turn an array of strings, that are step-tags into an array of step definitions for those step tags
 * @return {null|Array} null if no defaultStepTags details are found, otherwise an array of step objects
 */
const getDefaultStepTagsDetail = createSelector(
  getFilteredStepGroups, // Because we don't want to navigate to a step that we're not even showing
  getDefaultStepTags,
  (stepGroups, defaultStepTags) => {
    // Check if we have anything to go through, otherwise return null.
    if (
      !stepGroups ||
      stepGroups.length === 0 ||
      !defaultStepTags ||
      defaultStepTags.length === 0
    )
      return null;

    // To store the array of step objects for the default step tags
    // defaultStepTagsDetails will be already sorted because it'll be
    // filled sequentially while going through a pre-ordered list of steps.
    let defaultStepTagsDetails = [];

    let breakLoop = false; // To break loop without iterating over any further objects

    for (const stepGroup of stepGroups) {
      // Go through all the stepGroups
      for (const step of stepGroup.steps) {
        // Go Through all the steps
        if (defaultStepTags.includes(step.definition_tag))
          // Found the step details for a Step Tag
          defaultStepTagsDetails.push(step);

        // Check whether we've got all what we wanted, if so, break the loop
        if (
          (breakLoop = defaultStepTagsDetails.length === defaultStepTags.length)
        )
          break;
      }

      if (breakLoop) break;
    }

    // Return null if we couldn't find any matching definition for the step tags
    return defaultStepTagsDetails.length ? defaultStepTagsDetails : null;
  }
);

/**
 * Find the best possible match for the step that we need user to land upon
 * by picking the first imcompleted step from the list of all the defaultStepTags
 * otherwise, just using the last one from the list.
 * @param {object} state Redux State
 * @param {number} workflowId workflow ID
 * @returns {object} returns the {groupId, stepId} for one of the selected defaultStepTags
 */
export const getDefaultStepTagsGroupAndStep = createSelector(
  getDefaultStepTagsDetail,
  defaultStepTagsDetails => {
    if (!defaultStepTagsDetails) return null;

    let targetStepDetails = null;

    // Finding first incomplete step from the defaultSteps
    for (const defaultStep of defaultStepTagsDetails) {
      if (!defaultStep.completed_at) {
        targetStepDetails = defaultStep;
        break;
      }
    }

    if (!targetStepDetails)
      // If we couldn't find any incomplete step, navigate to last one
      targetStepDetails = defaultStepTagsDetails.pop();

    return {
      stepId: targetStepDetails.id,
      groupId: targetStepDetails.step_group
    };
  }
);
