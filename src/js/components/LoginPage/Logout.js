import React from "react";
import { logout } from "../../actions";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    localStorage.removeItem("user");
    var res = document.cookie;
    var multiple = res.split(";");
    for (var i = 0; i < multiple.length; i++) {
      var key = multiple[i].split("=");
      document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
    this.props.dispatch(logout());
  };

  render() {
    return <Redirect to="/login" />;
  }
}

export default Logout;
