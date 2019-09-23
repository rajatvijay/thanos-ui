import { getFilteredStepGroups } from "../sidebar.selectors";

test("should filter steps based on accessible dependent steps", () => {
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
          is_locked: true,
          definition: 5,
          dependent_steps: [{ value: 100, label: "Unavailable dependent step" }]
        },
        {
          id: 6,
          completed_by: null,
          name: "Step 4",
          alerts: [],
          is_locked: true,
          definition: 6,
          dependent_steps: [{ value: 2, label: "Step 1" }]
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
          is_locked: true,
          definition: 8,
          dependent_steps: [{ value: 2, label: "Step 1" }]
        },
        {
          id: 9,
          completed_by: null,
          name: "Step 6",
          alerts: [],
          is_locked: true,
          definition: 9,
          dependent_steps: [
            { value: 2, label: "Step 1" },
            { value: 3, label: "Step 2" }
          ]
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
          is_locked: true,
          definition: 11,
          dependent_steps: [{ value: 100, label: "Unavailable dependent step" }]
        },
        {
          id: 12,
          completed_by: null,
          name: "Step 8",
          alerts: [],
          is_locked: true,
          definition: 12,
          dependent_steps: [
            { value: 100, label: "Unavailable dependent step" },
            { value: 3, label: "Step 2" }
          ]
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
    }
  };

  const stepGroups = getFilteredStepGroups(state, 101);
  expect(stepGroups.length).toBe(3);
  expect(stepGroups[1].steps.length).toBe(1);
  expect(stepGroups[2].steps.length).toBe(2);
});
