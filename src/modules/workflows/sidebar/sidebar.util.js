/**
 * Consolidates all the steps's definition value from all the steps
 * in all the step groups
 *
 * @param {Array} stepGroups Array of integers having consolidated steps'
 * definition value from all the step groups
 */
export const getVisibleSteps = stepGroups => {
  // If we dont have an array of stepGroups,
  // we return a blank array.
  if (!Array.isArray(stepGroups)) return [];

  // Return consolidated array of all the steps' definition value
  return stepGroups.reduce(
    (consolidatedStepValues, stepGroup) => [
      ...consolidatedStepValues,
      ...stepGroup.steps.map(step => step.definition)
    ],
    []
  );
};

/**
 * Returns true onlßy when all the dependent steps of a particular steps
 * are visible/accessible.
 *
 * @param {object} step
 * @param {Array} visibleSteps
 */
export const hasAccessibleDependencies = (step, visibleSteps) =>
  step.dependent_steps.every(dependentStep =>
    visibleSteps.includes(dependentStep.value)
  );
