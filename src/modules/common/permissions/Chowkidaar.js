import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

const userHasPermission = ({ permissionsAllowed, permissionName }) =>
  permissionsAllowed && permissionsAllowed.includes(permissionName);

/**
 * TODO Add argument of element that should be rendered if permission is missing
 * @param check Permission to check against
 * @param children Default prop provided by React
 * @param props Redux props + any props passed from parent
 * @returns {null|React.DetailedReactHTMLElement<any, HTMLElement>[]}
 * @private
 */
const _Chowkidaar = (check, children, props) => {
  if (
    userHasPermission({
      permissionsAllowed: props.config.permissions,
      permissionName: check
    })
  ) {
    return React.Children.map(children, child => {
      return React.cloneElement(child, { ...props, ...child.props });
    });
  } else {
    return null; // TODO: or custom element that needs to be rendered
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
