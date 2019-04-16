/**
 * This file contains the utilities used throughout the app
 *
 * Guidelines
 * 1. These functions should be pure, hence testable
 * 2. Every function should be name exported
 *
 * CAUTION: Please dont use any lodash here
 */

/**
 * Converts the first char of the string to uppercase
 * @param {string} str
 */
export const uppcaseFirstChar = str => {
  if (typeof str !== "string") {
    throw new Error(`Expected string got ${typeof str}`);
  }

  if (!str) return str;

  return str[0].toUpperCase() + str.substr(1);
};

/**
 * Make a string human readable
 * 1. Replaces the underscores with spaces
 * 2. Uppercases each word
 * @param {string} str
 */
export const sanitizeBackenString = str => {
  if (typeof str !== "string") {
    throw new Error(`Expected string got ${typeof str}`);
  }

  if (!str) {
    return str;
  }

  return str
    .split("_")
    .map(word => uppcaseFirstChar(word))
    .join(" ");
};
