/**
 * Generator function to generate action creators
 *
 * Action Creators: https://redux.js.org/basics/actions#action-creators
 *
 * Approach: This approach make sure that
 * all the action creators have the same signature
 *
 * @param {string} type
 * @returns {function} ActionCreators
 */
export const makeActionCreator = type => payload => ({ type, payload });
