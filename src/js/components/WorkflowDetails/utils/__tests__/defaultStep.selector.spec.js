import { getDefaultStepTagsGroupAndStep } from "../defaultStep.selector";

test("should return null when no data is present", () => {
  const state = {
    workflowDetails: {
      101: {
        workflowDetails: {}
      }
    }
  };
  const defaultStepGroupAndStep = getDefaultStepTagsGroupAndStep(state, 101);
  expect(defaultStepGroupAndStep).toBe(null);
});

test("should return null when default_step_tags are present but steps are not loaded yet", () => {
  const state = {
    workflowDetails: {
      101: {
        workflowDetails: {}
      }
    },
    workflowDetailsHeader: {
      101: {
        definition: {
          default_step_tags: ["tag1", "tag2"]
        }
      }
    }
  };
  const defaultStepGroupAndStep = getDefaultStepTagsGroupAndStep(state, 101);
  expect(defaultStepGroupAndStep).toBe(null);
});

test("should return null when default_step_tags is blank", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          is_locked: false,
          definition: 2
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 2",
          alerts: [],
          is_locked: false,
          definition: 3
        }
      ],
      overdue: false
    }
  ];
  const state = {
    workflowDetails: {
      101: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    },
    workflowDetailsHeader: {
      101: {
        definition: {
          default_step_tags: []
        }
      }
    }
  };
  const defaultStepGroupAndStep = getDefaultStepTagsGroupAndStep(state, 101);
  expect(defaultStepGroupAndStep).toBe(null);
});

test("should return last complete step when all default_step_tags are completed", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          definition: 2,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step1"
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 2",
          alerts: [],
          definition: 3,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step2"
        }
      ],
      overdue: false
    },
    {
      id: 4,
      definition: { name_en: "Group 2" },
      steps: [
        {
          id: 5,
          completed_by: null,
          name: "Step 3",
          alerts: [],
          definition: 5,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step3"
        },
        {
          id: 6,
          completed_by: null,
          name: "Step 4",
          alerts: [],
          definition: 6,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step4"
        }
      ],
      overdue: false
    },
    {
      id: 7,
      definition: { name_en: "Group 3" },
      steps: [
        {
          id: 8,
          completed_by: null,
          name: "Step 5",
          alerts: [],
          definition: 8,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 7,
          definition_tag: "step5"
        },
        {
          id: 9,
          completed_by: null,
          name: "Step 6",
          alerts: [],
          definition: 9,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 7,
          definition_tag: "step6"
        }
      ],
      overdue: false
    },
    {
      id: 10,
      definition: { name_en: "Group 4" },
      steps: [
        {
          id: 11,
          completed_by: null,
          name: "Step 7",
          alerts: [],
          definition: 11,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 10,
          definition_tag: "step7"
        },
        {
          id: 12,
          completed_by: null,
          name: "Step 8",
          alerts: [],
          definition: 12,
          step_group: 10,
          definition_tag: "step8"
        }
      ],
      overdue: false
    }
  ];

  let state = {
    workflowDetails: {
      101: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    },
    workflowDetailsHeader: {
      101: {
        definition: {
          default_step_tags: ["step7", "step5", "step2", "step6"]
        }
      }
    }
  };

  const defaultStepGroupAndStep = getDefaultStepTagsGroupAndStep(state, 101);
  expect(defaultStepGroupAndStep.stepId).toBe(11);
  expect(defaultStepGroupAndStep.groupId).toBe(10);
});
test("should return first incomplete step from default_step_tags", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          definition: 2,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step1"
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 2",
          alerts: [],
          definition: 3,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step2"
        }
      ],
      overdue: false
    },
    {
      id: 4,
      definition: { name_en: "Group 2" },
      steps: [
        {
          id: 5,
          completed_by: null,
          name: "Step 3",
          alerts: [],
          definition: 5,
          step_group: 4,
          definition_tag: "step3"
        },
        {
          id: 6,
          completed_by: null,
          name: "Step 4",
          alerts: [],
          definition: 6,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 4,
          definition_tag: "step4"
        }
      ],
      overdue: false
    },
    {
      id: 7,
      definition: { name_en: "Group 3" },
      steps: [
        {
          id: 8,
          completed_by: null,
          name: "Step 5",
          alerts: [],
          definition: 8,
          step_group: 7,
          definition_tag: "step5"
        },
        {
          id: 9,
          completed_by: null,
          name: "Step 6",
          alerts: [],
          definition: 9,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 7,
          definition_tag: "step6"
        }
      ],
      overdue: false
    },
    {
      id: 10,
      definition: { name_en: "Group 4" },
      steps: [
        {
          id: 11,
          completed_by: null,
          name: "Step 7",
          alerts: [],
          definition: 11,
          completed_at: "2019-10-22T12:46:48.203108Z",
          step_group: 10,
          definition_tag: "step7"
        },
        {
          id: 12,
          completed_by: null,
          name: "Step 8",
          alerts: [],
          definition: 12,
          step_group: 10,
          definition_tag: "step8"
        }
      ],
      overdue: false
    }
  ];

  let state = {
    workflowDetails: {
      101: {
        workflowDetails: {
          stepGroups: {
            results: fakeStepGroups
          }
        }
      }
    },
    workflowDetailsHeader: {
      101: {
        definition: {
          default_step_tags: ["step7", "step5", "step3", "step6"]
        }
      }
    }
  };

  const defaultStepGroupAndStep = getDefaultStepTagsGroupAndStep(state, 101);
  expect(defaultStepGroupAndStep.stepId).toBe(5);
  expect(defaultStepGroupAndStep.groupId).toBe(4);
});
