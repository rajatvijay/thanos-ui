import _ from "lodash";

export const calculatedData = {
  getProcessedData,
  getProgressData
};

function getProcessedData(item) {
  let data = item;
  _.map(data, function(group, index) {
    let groupComplete = true;
    _.map(group.steps, function(step) {
      if (step.completed_at === null) {
        groupComplete = false;
      }
    });

    data[index].completed = groupComplete;
  });

  return data;
}

function getProgressData(item) {
  //currently not accounting for hidden steps.
  //could cause difference in results

  let progress = 0;
  let allSteps = null;
  let stepCompleted = 0;

  _.forEach(item.step_groups, function(group) {
    _.forEach(group.steps, function(step) {
      allSteps += 1;
      if (step.completed_at !== null) {
        stepCompleted += 1;
      }
    });
  });

  progress = Math.trunc(stepCompleted / allSteps * 100);
  return progress;
}
