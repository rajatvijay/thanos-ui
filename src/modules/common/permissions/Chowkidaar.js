import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { find as _find, isEmpty, includes } from "lodash";

const checkPermission = ({ permissionsAllowed, permissionName }) => {
  return (
    permissionsAllowed &&
    _find(permissionsAllowed, perm => includes(perm, permissionName))
  );
};

/**
 * TODO Add argument of element that should be rendered if permission is missing
 * @param check Permission to check against
 * @param children Default prop provided by React
 * @param permissions Redux permissions state
 * @param deniedElement Custom element to be shown if user doesn't have permissions
 * @param otherProps Props passed from parent
 * @returns {null|React.DetailedReactHTMLElement<any, HTMLElement>[]}
 * @private
 */

const _Chowkidaar = ({
  children,
  permissions,
  check,
  dispatch, // We don't want dispatch goes to child with otherProps
  deniedElement = null,
  ...otherProps
}) => {
  if (
    permissions.loading ||
    isEmpty(permissions) ||
    isEmpty(permissions.permissions)
  ) {
    // Permissions aren't loaded yet, don't show anything and wait for when they'll be loaded
    return null;
  }

  const hasPermission = checkPermission({
    permissionsAllowed: permissions.permissions,
    permissionName: check
  });

  if (hasPermission) {
    return React.Children.map(children, child => {
      return child // child can be null
        ? React.cloneElement(child, { ...otherProps, ...child.props })
        : child;
    });
  } else {
    return deniedElement;
  }
};

_Chowkidaar.propTypes = {
  check: PropTypes.any.isRequired
};

function mapStateToProps(state) {
  const { permissions } = state;
  return { permissions };
}

const Chowkidaar = connect(mapStateToProps)(_Chowkidaar);

export { Chowkidaar, checkPermission };
