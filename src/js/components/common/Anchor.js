import React from "react";

/**
 * This Anchor component will render an HTML <a /> tag but whenever
 * href is either blank, `#` or `javascript:void(0)` then it shall
 * not render that component with href tag and will instead use
 * event.preventDefault so that linter is happy.
 *
 * @param {React.HTMLProps<HTMLAnchorElement>} props
 */
export default function(props) {
  const { href, children = [], ...otherProps } = props;
  const additionalProps = {};
  if (!!href === false || href === "#" || href === "javascript:void(0)") {
    additionalProps.onClick = e => e.preventDefault();
  } else {
    additionalProps.href = href;
  }

  return (
    <a {...additionalProps} {...otherProps}>
      {children}
    </a>
  );
}
