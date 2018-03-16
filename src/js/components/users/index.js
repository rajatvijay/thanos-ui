import React, { Component } from "react";
import { Layout } from "antd";
import CardList from "./card-list";
import Profile from "./profile";
import UserFilter from "./filter";
import _ from "lodash";

const { Sider, Content } = Layout;

const usersList = [
  {
    username: "junaid lone",
    initials: "JL",
    id: 1,
    email: "junaid@thevetted.com",
    phone: "+91 9123456789",
    rating: 4,
    relatedWorkflow: 2,
    company: "TheVetted",
    extra: {}
  },
  {
    username: "Gagandeep Singh",
    initials: "GS",
    id: 2,
    email: "gagan@thevetted.com",
    phone: "+91 9123456789",
    rating: 5,
    relatedWorkflow: 1,
    company: "Mckinsey"
  },
  {
    username: "Palak Arbol",
    initials: "PA",
    id: 3,
    email: "Palak@thevetted.com",
    phone: "+91 9123456789",
    rating: 4,
    relatedWorkflow: 3,
    company: "Intuit"
  },
  {
    username: "Tajinder Singh",
    initials: "TS",
    id: 4,
    email: "taj@thevetted.com",
    phone: "+91 9123456789",
    rating: 3,
    relatedWorkflow: 5,
    company: "Dun & Bradstreet"
  },
  {
    username: "Jagmeet Lamba",
    initials: "JL",
    id: 5,
    email: "jlamba@thevetted.com",
    phone: "+91 9123456789",
    rating: 3,
    relatedWorkflow: 9,
    company: "DowJones"
  }
];

const Users = ({ match }) => (
  <div>
    <UserList profile={match} />
  </div>
);

class UserList extends Component {
  constructor(props) {
    super();
    this.state = { sidebar: false, userId: null };
  }

  componentWillReceiveProps = newProps => {
    if (newProps) this.getUser(newProps);
  };

  componentDidMount = () => {
    this.getUser(this.props);
  };

  callBackCollapser = () => {
    this.setState({ sidebar: !this.state.sidebar });
  };

  getUser(props) {
    if (props.profile.params.id !== undefined) {
      const uid = parseInt(props.profile.params.id, 10);
      var user = _.find(usersList, { id: uid });
      this.setState({ sidebar: false, userId: uid, user: user }, function() {
      });
    }
  }

  render() {
    return (
      <Layout className="users-container inner-container">
        <Sider
          width={250}
          style={{ overflow: "auto", height: "100vh", position: "fixed" }}
          className="aux-nav aux-nav-filter bg-primary-light"
        >
          <h5 className="aux-item aux-lead">Filters</h5>
          <div className="aux-item aux-lead">
            <UserFilter placeholder="skill" />
          </div>
          <div className="aux-item aux-lead">
            <UserFilter placeholder="Name" />
          </div>
          <div className="aux-item aux-lead">
            <UserFilter placeholder="Supplier company" />
          </div>
          <div className="aux-item aux-lead">
            <UserFilter placeholder="Country" />
          </div>
          <div className="aux-item aux-lead">
            <UserFilter placeholder="Group" />
          </div>
        </Sider>
        <Layout style={{ marginLeft: 250 }}>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <CardList userList={usersList} />
          </Content>

          {this.state.userId ? (
            <Profile
              user={this.state.user}
              sidebar={this.state.sidebar}
              toggleSidebar={this.callBackCollapser}
            />
          ) : null}
        </Layout>
      </Layout>
    );
  }
}

export default Users;
