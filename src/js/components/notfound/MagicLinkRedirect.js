import React from "react";
import { Link } from "react-router-dom";

import { FormattedMessage } from "react-intl";

const MagicLinkRedirect = props => {
  return (
    <div className="text-center">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <p className="t-22">
        <FormattedMessage id="errorMessageInstances.magicLinkExpired" />
        <br />
        <Link to="/login/magic">
          {" "}
          <b>
            <FormattedMessage id="commonTextInstances.clickHere" />
          </b>
        </Link>{" "}
        <FormattedMessage id="errorMessageInstances.magicLinkgenerateNew" />
      </p>
      <b>
        <FormattedMessage id="errorMessageInstances.magicLinkExpirationWindow" />
      </b>
    </div>
  );
};

export default MagicLinkRedirect;
