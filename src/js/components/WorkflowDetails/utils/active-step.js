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
    return {
      workflowId: workflowId,
      groupId: stepData.results[0].id,
      stepId: stepData.results[0].steps[0].id
    };
  }
};

// UN-BORN/UN-USED CHILD @rajatvijay
// This method is not being used anywhere
// But keeping it since
// could be used later
export const getNextStepAndGroup = (
  currentGroupId,
  currentStepId,
  allVisibleStepGroups
) => {
  // Steps hasn't been loaded yet
  if (!allVisibleStepGroups.length) {
    return [null, null];
  }

  // User is on the profile step
  if (!currentStepId && !currentGroupId) {
    return [allVisibleStepGroups[0].id, allVisibleStepGroups[0].steps[0].id];
  }

  // Find the index of currentStepGroup and currentStep
  let currentStepGroupIndex, currentStepIndex;
  allVisibleStepGroups.forEach((group, groupIndex) => {
    if (group.id === Number(currentGroupId)) {
      currentStepGroupIndex = groupIndex;
      group.steps.forEach((step, stepIndex) => {
        if (step.id === Number(currentStepId)) {
          currentStepIndex = stepIndex;
        }
      });
    }
  });

  const nextStep =
    allVisibleStepGroups[currentStepGroupIndex].steps[currentStepIndex + 1];

  // If we have the next step in the same group
  if (nextStep) {
    return [currentGroupId, nextStep.id];
  }

  const nextStepGroup = allVisibleStepGroups[currentStepGroupIndex + 1];

  // Take the user to the first step of the next stepgroup
  if (nextStepGroup) {
    return [nextStepGroup.id, nextStepGroup.steps[0].id];
  }

  // User is already on the last step group and last step
  return [null, null];
};
