import React from "react";
import { logout } from "../../actions";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  componentDidMount = () => {
    localStorage.removeItem("user");
    const res = document.cookie;
    const multiple = res.split(";");
    for (let i = 0; i < multiple.length; i++) {
      const key = multiple[i].split("=");
      document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
    this.props.dispatch(logout());
  };

  render() {
    return <Redirect to="/login" />;
  }
}

export default Logout;
