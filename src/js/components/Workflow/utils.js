import _ from "lodash";

export const utils = {
  getVisibleSteps,
  isLockedStepEnable,
  isLockedStepGroupEnable
};

// method to get all visible steps
function getVisibleSteps(step_data) {
  var visible_step_id = [];
  _.forEach(step_data, function(sg) {
    _.forEach(sg.steps, function(step) {
      visible_step_id.push(step.id);
    });
  });
  return visible_step_id;
}

// method to check if locked step's dependent step is visible or not
function isLockedStepEnable(s, visible_steps) {
  let dependent_step_visibility_count = 0;
  _.forEach(s.dependent_steps, function(ds) {
    if (visible_steps.indexOf(parseInt(ds.value)) != -1) {
      dependent_step_visibility_count++;
    }
  });
  if (s.dependent_steps.length != dependent_step_visibility_count) {
    return false;
  }
  return true;
}

function isLockedStepGroupEnable(sg, visible_steps) {
  let locked_step_count = 0;
  _.forEach(sg.steps, function(step) {
    if (!isLockedStepEnable(step, visible_steps)) {
      locked_step_count++;
    }
  });
  if (sg.steps.length == locked_step_count) {
    return false;
  }
  return true;
}
