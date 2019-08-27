import {
  checkPermissionOverlap,
  PERMISSION_OVERLAP_METHODS
} from "../../modules/common/permissions/utils";
import Permissions from "../../modules/common/permissions/constants";

/**
 * The sole purpose of this file is to write the cross-cutting utilities
 * that should be used across fields. We'd want to move these to a HOC
 * or a base class like hierarchy in the future
 */

export const isEditable = ({ field }) => {
  return field.is_editable === undefined ? true : field.is_editable;
};

export const hasResponseCUDPermission = ({ permissions }) => {
  return checkPermissionOverlap({
    permissionsToCheck: [
      Permissions.CAN_ADD_RESPONSE,
      Permissions.CAN_CHANGE_RESPONSE,
      Permissions.CAN_DELETE_RESPONSE
    ],
    allowedPermissions: permissions,
    method: PERMISSION_OVERLAP_METHODS.ANY
  });
};

export const isDisabled = props => {
  const field = props.currentStepFields.currentStepFields;

  if (!isEditable({ field })) return true;

  return (
    props.completed ||
    props.is_locked ||
    props.field.definition.disabled ||
    !hasResponseCUDPermission({ permissions: props.permissions })
  );
};
