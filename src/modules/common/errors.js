export const requiredParam = param => {
  new Error(`Required parameter, "${param}" is missing.`);
};
