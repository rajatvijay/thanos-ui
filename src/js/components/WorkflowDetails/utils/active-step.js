import _ from "lodash";

//calculate step data
export const currentActiveStep = (stepData, workflowId) => {
  let activeStepGroup = null;
  let activeStep = null;

  _.forEach(stepData.results, step_group => {
    //if empty goto next group
    if (step_group.is_complete || _.isEmpty(step_group.steps)) {
      return;
    }

    // not step group empty set current group to active
    activeStepGroup = step_group;

    // If steps uneditable exit loop
    _.forEach(step_group.steps, step => {
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

  // this conditions is satisfies only when all step groups are completed
  // This will choose the last group and last step as active
  if (!activeStepGroup) {
    let last_sg_index = stepData.results.length - 1;
    activeStepGroup = stepData.results[last_sg_index];
    let last_step_index = activeStepGroup.steps.length - 1;
    activeStep = activeStepGroup.steps[last_step_index];
  }

  // this condition will execute when step is available but steps inside are not available for edit (i.e. locked/completed)
  if (activeStepGroup && !activeStep) {
    let last_step_index = activeStepGroup.steps.length - 1;
    activeStep = activeStepGroup.steps[last_step_index];
  }

  // return calculated active step data
  if (activeStep) {
    return {
      workflowId: workflowId,
      groupId: activeStepGroup.id,
      stepId: activeStep.id
    };
  } else {
    //if no active step could be calculated for any reason
    //this will choose first step of first group as active
    let actStepGrp = stepData.results[0];
    let actStep = stepData.results[0].steps[0];
    return {
      workflowId: workflowId,
      groupId: actStepGrp && actStepGrp.id,
      stepId: actStep && actStep.id
    };
  }
};
