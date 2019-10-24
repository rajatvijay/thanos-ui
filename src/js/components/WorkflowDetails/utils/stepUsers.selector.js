import { createSelector } from "reselect";
import { get as lodashGet } from "lodash";

const getStepUsers = (state, stepId) =>
  lodashGet(state, "stepUsers." + stepId + ".data", null);

/**
 * To filter and sort the list of users that can be assigned on a particular step
 * alphabetically with priority given to first name and inabsense of that, email
 * @param {object} state Redux State
 * @param {number} stepId step ID
 * @returns {array} returns sorted array of user objects
 */
export const getSortedUserAssignmentList = createSelector(
  getStepUsers,
  stepUsers =>
    stepUsers
      ? stepUsers
          .filter(user => !!user.email) // Without email, it's not even a real user, so we filter such items out
          .sort((a, b) => {
            const elementA = (a.full_name.trim() || a.email).toUpperCase();
            const elementB = (b.full_name.trim() || b.email).toUpperCase();
            if (elementA > elementB) return 1;
            else if (elementB > elementA) return -1;
            else return 0;
          })
      : null
);
