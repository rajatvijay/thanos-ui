import { getVisibleWorkflowKinds } from "../createNew.selector";

test("should ommit the workflows that are either related workflows or those that don't allow 'add_workflow' feature", () => {
  const state = {
    workflowKind: {
      workflowKind: [
        {
          is_related_kind: false,
          tag: "kind-1",
          name: "Kind 1",
          features: []
        },
        {
          is_related_kind: false,
          tag: "kind-2",
          name: "Kind 2",
          features: []
        },
        {
          is_related_kind: true,
          tag: "kind-3",
          name: "Kind 3",
          features: ["add_workflow"]
        },
        {
          is_related_kind: false,
          tag: "kind-4",
          name: "Kind 4",
          features: ["add_workflow"]
        },
        {
          is_related_kind: false,
          tag: "users",
          name: "Users",
          features: ["add_workflow"]
        },
        {
          is_related_kind: false,
          tag: "entity-id",
          name: "Entity ID",
          features: ["add_workflow"]
        }
      ]
    }
  };

  const groups = getVisibleWorkflowKinds(state);
  expect(groups.length).toBe(1);
  expect(groups).toContain(state.workflowKind.workflowKind[3]);
});
