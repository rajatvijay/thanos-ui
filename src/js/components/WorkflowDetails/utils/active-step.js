//calculate step data
export const currentActiveStep = (stepData, workflowId) => {
  let activeStepGroup = null;
  let lastCompletedStepGroup = null;
  let activeStep = null;
  let isLast = false;

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
      if (step.is_editable && !step.completed_at && !step.is_locked) {
        activeStep = step;
        // If steps editable exit loop
        return false;
      }
      return true;
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
    isLast = true;
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
      stepId: activeStep.id,
      isLast: isLast
    };
  } else {
    //FAIL SAFE
    //if no active step could be calculated for any reason
    //this will choose first step of first group as active
    const activeStepGroup = stepGroups[0];
    const activeStep = activeStepGroup.steps[0];
    const isLast = true;

    return {
      workflowId: workflowId,
      groupId: activeStepGroup && activeStepGroup.id,
      stepId: activeStep && activeStep.id,
      isLast: isLast
    };
  }
};
