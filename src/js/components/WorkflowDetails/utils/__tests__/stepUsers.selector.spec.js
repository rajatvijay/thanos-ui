import { getSortedUserAssignmentList } from "../stepUsers.selector";

test("should return null if no users are present", () => {
  const state = {
    stepUsers: {}
  };
  const defaultStepGroupAndStep = getSortedUserAssignmentList(state, 101);
  expect(defaultStepGroupAndStep).toBe(null);
});

test("should return 3 users sorted alphabetically", () => {
  const state = {
    stepUsers: {
      101: {
        data: [
          {},
          { id: 0, full_name: "", email: "" }, // will get omitted, due to lack of email
          { id: 1, full_name: "John Doe", email: "jdoe@thevetted.com" },
          { id: 2, full_name: "", email: "abc@def.com" },
          { id: 3, full_name: "Doe Jane", email: "janedoe@thevetted.com" }
        ]
      }
    }
  };
  const defaultStepGroupAndStep = getSortedUserAssignmentList(state, 101);
  expect(defaultStepGroupAndStep[0].email).toBe("abc@def.com");
  expect(defaultStepGroupAndStep[1].email).toBe("janedoe@thevetted.com");
  expect(defaultStepGroupAndStep[2].email).toBe("jdoe@thevetted.com");
});
