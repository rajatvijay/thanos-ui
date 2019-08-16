import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

const userHasPermission = ({ permissionsAllowed, permissionName }) =>
  permissionsAllowed && permissionsAllowed.includes(permissionName);

/**
 * TODO Add argument of element that should be rendered if permission is missing
 * @param check Permission to check against
 * @param children Default prop provided by React
 * @param config Redux config state
 * @param otherProps Props passed from parent
 * @returns {null|React.DetailedReactHTMLElement<any, HTMLElement>[]}
 * @private
 */
const _Chowkidaar = ({
  children,
  config,
  check,
  deniedElement,
  ...otherProps
}) => {
  if (
    userHasPermission({
      permissionsAllowed: config.permissions,
      permissionName: check
    })
  ) {
    return React.Children.map(children, child => {
      return React.cloneElement(child, { ...otherProps, ...child.props });
    });
  } else {
    return deniedElement || null; // TODO: or custom element that needs to be rendered
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

export { Chowkidaar, userHasPermission };
