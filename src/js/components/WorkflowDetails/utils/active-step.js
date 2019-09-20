//calculate step data
export const currentActiveStep = (stepData, workflowId) => {
  let activeStepGroup = null;
  let lastCompletedStepGroup = null;
  let activeStep = null;

  if (!stepData || !Array.isArray(stepData.results) || !stepData.results.length)
    return {}; // null would explode in places where we've got spread operators.

  let stepGroups = stepData.results.filter(stepGroup => stepGroup.steps.length);

  // If there are no step groups after filtering, no point of going forward.
  if (!stepGroups.length) return {};

  stepGroups.every(stepGroup => {
    // Save the last completed step group, in case
    // we want to fallback to it.
    // Sentry : https://sentry.io/organizations/vetted/issues/1143504056/?project=1382744
    if (stepGroup.is_complete && stepGroup.steps.length) {
      lastCompletedStepGroup = stepGroup;
      return true;
    }

    activeStepGroup = stepGroup;

    stepGroup.steps.every(step => {
      if (step.is_editable && !step.completed_at && !step.is_locked)
        activeStep = step;
      return !activeStep;
    });

    // if active step available exit loop
    return !activeStep;
  });

  // This conditions is satisfies only when all step groups are completed
  // for the user. This will set the last group and last step as active
  if (!activeStepGroup && lastCompletedStepGroup) {
    activeStepGroup = lastCompletedStepGroup;

    const lastStepIndex = activeStepGroup.steps.length - 1;
    activeStep = activeStepGroup.steps[lastStepIndex];
  }

  // This condition will execute when step is available but steps
  // inside are not available for edit (i.e. locked/completed)
  if (activeStepGroup && !activeStep) {
    const lastStepIndex = activeStepGroup.steps.length - 1;
    activeStep = activeStepGroup.steps[lastStepIndex];
  }

  // return calculated active step data
  if (activeStep) {
    return {
      workflowId: workflowId,
      groupId: activeStepGroup.id,
      stepId: activeStep.id
    };
  } else {
    //FAIL SAFE
    //if no active step could be calculated for any reason
    //this will choose first step of first group as active
    const { firstGroupId, firstStepId } = getStepId(null, stepData);

    return {
      workflowId: workflowId,
      groupId: firstGroupId,
      stepId: firstStepId
    };
  }
};

/**
 * This function will return the Group ID and Step ID for the step that we're
 * looking for, based on it's tag. If not found, it'll return the first
 * accessible step's ID and it's Group ID.
 *
 * @param {string} tag step tag that we're looking for
 * @param {object} stepData step groups data
 *
 * @returns {object} {groupId, stepId, firstGroupId, firstStepId} where groupId
 * and stepId are for the step that have the tag that we were looking for, and
 * as a fallback we have firstGroupId and firstStepId which contains the groupId
 * and stepId for the first accessible step to handle fallback cases.
 */
export const getStepId = (tag, stepData) => {
  let firstGroupId = null; // to store a fallback group ID
  let firstStepId = null; // to store a step ID for the fallbout group ID

  let groupId = null; // to store target group
  let stepId = null; // to store target step of target group

  if (stepData.results) {
    // if we have results, we will filter out step groups that have steps in them.
    const stepGroups = stepData.results.filter(
      stepGroup => stepGroup.steps.length
    );

    // Now for every step group, we iterate to find the first step group
    // that we can use.
    stepGroups.every(stepGroup => {
      // Let's go through the steps in this step group
      stepGroup.steps.every(step => {
        // For fallback, we just keep a set of first groups's ID and it's first
        // step ID, that is accessible to the user.
        if (!firstStepId) {
          firstGroupId = stepGroup.id;
          firstStepId = step.id;
        }

        // Now look for the step tag
        if (tag && step.definition_tag === tag) {
          // if we've found the step that we were looking for
          groupId = stepGroup.id;
          stepId = step.id;
        }

        return !stepId; // continue loop if not found
      });

      // Now if we're found a step, we will break the loop, otherwise, it'll
      // continue to the next step group.
      return !stepId;
    });
  }

  // We return whatever we have
  return {
    groupId,
    stepId,
    firstGroupId,
    firstStepId
  };
};
