import React from "react";
import { Link } from "react-router-dom";

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
        Sorry! You seem to have reached a link that no longer works. <br />
        Please{" "}
        <Link to="/login/magic">
          {" "}
          <b>Click here</b>
        </Link>{" "}
        to go to login page and generate a new link.
      </p>
    </div>
  );
};

export default MagicLinkRedirect;
