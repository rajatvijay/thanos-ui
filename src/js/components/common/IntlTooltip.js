import React from "react";
import { Tooltip } from "antd";
import { injectIntl } from "react-intl";

/**
 * Simple wrapper component that creates a Tooltip component
 * with inject-intl
 *
 * @param title Key that needs to be looked for in translation JSON
 * @param values JSON containing keys that needs to be replaced in string
 * @param children React child component(s)
 * @returns {React.DetailedReactHTMLElement<any, HTMLElement>[]}
 */
const IntlTooltip = injectIntl(
  ({ children, title = "", intl, values = {}, ...otherProps }) => (
    <Tooltip
      title={intl.formatMessage(
        {
          id: title
        },
        values
      )}
      {...otherProps}
    >
      {children}
    </Tooltip>
  )
);

export default IntlTooltip;
