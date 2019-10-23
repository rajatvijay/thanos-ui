import React from "react";
import { Route, Redirect } from "react-router-dom";
import Godaam from "../utils/storage";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Godaam.user ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            // Redirecting the user to login means,
            // he/she needs to go to some specifix url after login
            pathname: `/login`,
            search: rest.location.search
              ? `?next=${encodeURIComponent(
                  rest.location.pathname + rest.location.search
                )}`
              : `?next=${rest.location.pathname}`,
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
