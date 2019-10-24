import React from "react";
import { Input, Menu } from "antd";
import { injectIntl } from "react-intl";

class StepAssignmentUsers extends React.Component {
  state = {
    queryString: ""
  };
  updateQueryString = e => {
    const { value } = e.target;
    this.setState({ queryString: value });
  };
  getFilteredUsers = () => {
    const { users = [] } = this.props;
    const { queryString } = this.state;
    return users.filter(user =>
      user.full_name.toLowerCase().includes(queryString.toLowerCase())
    );
  };
  handleUserClick = user => () => {
    this.props.onSelectUser(user);
  };
  getFormattedUserFullName = user => {
    return user.full_name.trim();
  };
  render() {
    return (
      <div>
        <Input
          style={{ padding: "0 14px" }}
          placeholder={this.props.intl.formatMessage({
            id: "userWorkflowInstances.searchUser"
          })}
          onChange={this.updateQueryString}
        />
        <Menu style={{ maxHeight: 200, overflowY: "scroll" }}>
          {this.getFilteredUsers().map((user, index) => (
            <Menu.Item
              key={`${index}`}
              style={{ lineHeight: "25px", height: 25 }}
              onClick={this.handleUserClick(user)}
            >
              {this.getFormattedUserFullName(user) || user.email}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    );
  }
}

export default injectIntl(StepAssignmentUsers);
