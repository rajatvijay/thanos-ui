import { getVisibleWorkflowGroups } from "../taskQueue.selector";

test("should not return any of the workflow groups that are marked as hidden", () => {
  const state = {
    workflowGroupCount: {
      stepgroupdef_counts: [
        {
          tag: "tq10",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 1"
        },
        {
          tag: "tq11",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 2"
        }
      ]
    },
    config: {
      custom_ui_labels: {
        "workflows.hiddenGroupsMainNav": ["tq11", "tq13"]
      }
    }
  };

  const groups = getVisibleWorkflowGroups(state);
  expect(groups).toContain(state.workflowGroupCount.stepgroupdef_counts[0]);
  expect(groups).not.toContain(state.workflowGroupCount.stepgroupdef_counts[1]);
});

test("should return all workflows if config is not defined for hidden groups", () => {
  const state = {
    workflowGroupCount: {
      stepgroupdef_counts: [
        {
          tag: "tq10",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 1"
        },
        {
          tag: "tq11",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 2"
        },
        {
          tag: "tq12",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 3"
        },
        {
          tag: "tq13",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 4"
        }
      ]
    }
  };

  const groups = getVisibleWorkflowGroups(state);
  expect(groups.length).toBe(4);
});

test("should return all workflows if config doesn't have proper array", () => {
  const state = {
    workflowGroupCount: {
      stepgroupdef_counts: [
        {
          tag: "tq10",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 1"
        },
        {
          tag: "tq11",
          count: 532,
          overdue_count: 25,
          name: "Test Task Queue 2"
        }
      ]
    },
    config: {
      custom_ui_labels: {
        "workflows.hiddenGroupsMainNav": "tq11"
      }
    }
  };

  const groups = getVisibleWorkflowGroups(state);
  expect(groups.length).toBe(2);
});
