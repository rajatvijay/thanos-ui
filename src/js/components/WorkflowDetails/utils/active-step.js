import _ from "lodash";

//calculate step data
export const currentActiveStep = (stepData, workflowId) => {
  let activeStepGroup = null;
  let activeStep = null;
  let isLast = false;

  _.forEach(stepData.results, (step_group, index) => {
    //if empty goto next group
    if (step_group.is_complete || _.isEmpty(step_group.steps)) {
      return;
    }

    // not step group empty set current group to active
    activeStepGroup = step_group;

    // If steps uneditable exit loop
    _.forEach(step_group.steps, (step, index) => {
      if (step.is_editable && !step.completed_at && !step.is_locked) {
        activeStep = step;
        return false;
      }
    });

    // if active step available exit loop
    if (activeStep) {
      return false;
    }
  });

  // This conditions is satisfies only when all step groups are completed
  // This will choose the last group and last step as active
  if (!activeStepGroup) {
    const last_sg_index = stepData.results.length - 1;
    activeStepGroup = stepData.results[last_sg_index];

    const last_step_index = activeStepGroup.steps.length - 1;
    activeStep = activeStepGroup.steps[last_step_index];
    isLast = true;
  }

  // This condition will execute when step is available but steps
  // inside are not available for edit (i.e. locked/completed)
  if (activeStepGroup && !activeStep) {
    const last_step_index = activeStepGroup.steps.length - 1;
    activeStep = activeStepGroup.steps[last_step_index];
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
    const actStepGrp = stepData.results[0];
    const actStep = actStepGrp.steps[0];
    const isLast = true;

    return {
      workflowId: workflowId,
      groupId: actStepGrp && actStepGrp.id,
      stepId: actStep && actStep.id,
      isLast: isLast
    };
  }
};
