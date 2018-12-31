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
        We’re sorry, this link has expired.<br />
        <Link to="/login/magic">
          {" "}
          <b>Click here</b>
        </Link>{" "}
        to go to login page and generate a new link.
      </p>
      <b>Note: Link expires in 24 hours</b>
    </div>
  );
};

export default MagicLinkRedirect;
