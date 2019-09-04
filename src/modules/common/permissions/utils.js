export const PERMISSION_OVERLAP_METHODS = {
  ANY: "some",
  ALL: "every"
};

function requiredParam(param) {
  new Error(`Required parameter, "${param}" is missing.`);
}

export const checkPermissionOverlap = ({
  allowedPermissions = requiredParam("allowedPermissions"),
  permissionsToCheck = requiredParam("permissionsToCheck"),
  method = requiredParam("method")
}) => {
  return permissionsToCheck[method](
    permission => permission && allowedPermissions.includes(permission)
  );
};
