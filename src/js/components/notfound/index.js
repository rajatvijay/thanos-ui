import React from "react";
import { Link } from "react-router-dom";

export const GenericNotFound = () => {
  let param = document.location.search.split("=")[1];
  if (param === "magic-link") {
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
  } else {
    return (
      <div className="text-center">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1>
          ERROR 404!<br />
        </h1>
        <h3>Page Not Found</h3>
      </div>
    );
  }
};
