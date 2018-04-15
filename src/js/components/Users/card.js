import React, { Component } from "react";
import { Avatar, Row, Col, Icon, Rate } from "antd";
import { Link } from "react-router-dom";

class CardUser extends Component {
  constructor(props) {
    super(); // or super(props) ?
  }

  render() {
    const { user } = this.props;

    return (
      <div className="card">
        <div className="head">
          <Link to={"/users/" + user.id} className="head-link" replace>
            <span className="avatar">
              <Avatar size="large">{user.initials}</Avatar>
            </span>
            <div className="nameblock">
              <h4 className="username">{user.username}</h4>
              <div className="company-name">{user.company}</div>
            </div>
          </Link>
        </div>
        <div className="body">
          <Row>
            <Col span={24} className="mr-bottom-sm">
              <Icon className="text-primary" type="mail" /> {user.email}
            </Col>
            <Col span={24} >
              <Icon className="text-primary" type="phone" /> {user.phone}
            </Col>
          </Row>
        </div>
        <div className="body body-lower">
          <div>{user.relatedWorkflow} related workflow</div>
        </div>
        <div className="foot">
          <Row>
            <Col span={12} className="text-center">
              <Rate disabled defaultValue={user.rating} />
            </Col>
            <Col span={12} className="text-center">
              Rate
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CardUser;
