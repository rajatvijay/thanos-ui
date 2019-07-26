import React from "react";
import MagicLinkRedirect from "./MagicLinkRedirect";

export const GenericNotFound = () => {
  const param = document.location.search.split("=")[1];
  if (param === "magic-link") {
    return <MagicLinkRedirect />;
  } else {
    return (
      <div className="text-center">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1>
          ERROR 404!
          <br />
        </h1>
        <h3>Page Not Found</h3>
      </div>
    );
  }
};
