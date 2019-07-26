import React from "react";
import { connect } from "react-redux";

import { userActions } from "../../actions";

class HomePage extends React.Component {
  componentDidMount() {
    this.props.dispatch(userActions.getAll());
  }

  handleDeleteUser(id) {
    return e => this.props.dispatch(userActions.delete(id));
  }

  render() {
    return (
      <div className=" text-center">
        <br />
        <br />
        <br />
        <br />
        <h1>Feature coming soon</h1>
        <h4>Hang tight, this feature will come soon on VETTED</h4>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
