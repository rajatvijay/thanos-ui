import React, { Component } from "react";
import { Layout } from "antd";
import CardUser from "./card";
import _ from "lodash";

const { Content } = Layout;

class CardList extends Component {
  constructor(props) {
    super();
  }

  render() {
    const users = this.props.userList;

    return (
      <Layout>
        <Content style={{ padding: 24, margin: 0, minHeight: "100vh" }}>
          <div className="card-wrapper">
            {_.map(users, function(user) {
              return <CardUser key={user.id} user={user} />;
            })}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default CardList;
