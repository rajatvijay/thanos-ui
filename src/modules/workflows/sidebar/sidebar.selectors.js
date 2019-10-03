import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";
import { getVisibleSteps, hasAccessibleDependencies } from "./sidebar.util";

export const getStepGroups = (state, workflowId) =>
  lodashGet(
    state.workflowDetails,
    `[${workflowId}].workflowDetails.stepGroups.results`,
    []
  );

/**
 * Using reselect we're filtering the Step Groups that we need
 * on the basis of whether steps in the step group are either not
 * locked or if they are, then their all dependencies should be acceissible.
 * All else is ignored.
 * @param {object} state Redux State
 * @param {object} workflowId workflow ID
 * @returns {Array} Step Groups array that should be visible.
 */
export const getFilteredStepGroups = createSelector(
  getStepGroups,
  stepGroups => {
    const visibleSteps = getVisibleSteps(stepGroups);
    let filteredStepGroups = stepGroups.map(stepGroup => {
      const steps = stepGroup.steps.filter(step =>
        step.is_locked ? hasAccessibleDependencies(step, visibleSteps) : true
      );
      if (steps.length) return { ...stepGroup, steps };
      else return null;
    });

    return filteredStepGroups.filter(stepGroup => stepGroup !== null);
  }
);
