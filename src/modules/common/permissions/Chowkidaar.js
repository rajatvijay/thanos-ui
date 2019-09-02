import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

const checkPermission = ({ permissionsAllowed, permissionName }) =>
  permissionsAllowed && permissionsAllowed.includes(permissionName);

/**
 * TODO Add argument of element that should be rendered if permission is missing
 * @param check Permission to check against
 * @param children Default prop provided by React
 * @param config Redux config state
 * @param deniedElement Custom element to be shown if user doesn't have permissions
 * @param otherProps Props passed from parent
 * @returns {null|React.DetailedReactHTMLElement<any, HTMLElement>[]}
 * @private
 */

const _Chowkidaar = ({
  children,
  config,
  check,
  dispatch, // We don't want dispatch goes to child with otherProps
  deniedElement = null,
  ...otherProps
}) => {
  if (!config.permissions) {
    // Permissions aren't loaded yet, don't show anything and wait for when they'll be loaded
    return null;
  }

  const hasPermission = checkPermission({
    permissionsAllowed: config.permissions,
    permissionName: check
  });

  if (hasPermission) {
    return React.Children.map(children, child => {
      return React.cloneElement(child, { ...otherProps, ...child.props });
    });
  } else {
    return deniedElement;
  }
};

_Chowkidaar.propTypes = {
  check: PropTypes.any.isRequired
};

function mapStateToProps(state) {
  const { config } = state;
  return { config };
}

const Chowkidaar = connect(mapStateToProps)(_Chowkidaar);

export { Chowkidaar, checkPermission };
