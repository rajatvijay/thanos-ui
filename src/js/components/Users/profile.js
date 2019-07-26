import React, { Component } from "react";
import { Layout, Icon, Avatar, Collapse } from "antd";
import { Link } from "react-router-dom";
import Anchor from "../common/Anchor";

const { Sider } = Layout;

class Profile extends Component {
  constructor(props) {
    super();
  }

  callback = key => {};

  toggle = () => {
    this.props.toggleSidebar();
  };

  render() {
    const Panel = Collapse.Panel;

    return (
      <Sider
        className="profile-sidebar sidebar-right"
        style={{
          background: "#fff",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          right: 0
        }}
        width="350"
        collapsed={this.props.sidebar}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        trigger={null}
      >
        <div className="profile-details">
          <div className="sidebar-head">
            <span className="sidebar-title">Profile</span>
            <Link to="/users">
              <span className="close-trigger">
                <Icon
                  className="trigger"
                  type={this.props.sidebar ? "menu-unfold" : "menu-fold"}
                  onClick={this.toggle}
                />
              </span>
            </Link>
          </div>

          <div className="user-profile-top side-padder-16 vertical-padder-16">
            <div>
              <span className="avatar-wrapper ">
                <Avatar style={{ verticalAlign: "middle" }} size="large">
                  {this.props.user.initials}
                </Avatar>
              </span>
              <div className="user-name-wrap text-primary">
                <h4 className="name">{this.props.user.username}</h4>
                <div className="company opacity-half">
                  {this.props.user.company}
                </div>
              </div>
            </div>
          </div>
          <div className="user-profile-details">
            <ul>
              <li>
                <Icon type="export" /> Send Invitation
              </li>
              <li>
                <Icon type="mail" /> {this.props.user.email}
              </li>
              <li>
                <Icon type="check-circle text-green" /> Joined
              </li>
              <li>
                <Icon type="link" /> Copy invite link
              </li>
              <li>
                <Icon type="phone" /> {this.props.user.phone}
              </li>
              <li>
                <Icon type="environment-o" />
                United States
              </li>
            </ul>
          </div>

          <div className=" collapser">
            <Collapse defaultActiveKey={["1"]} onChange={this.callback}>
              <Panel
                header="Reviews and Rating (1)"
                key="1"
                className="rating-section"
              >
                <p>No rating</p>
              </Panel>
              <Panel
                header="Related Workflows (2)"
                key="2"
                className="related-workflow-section"
              >
                <p>
                  <ul>
                    <li>
                      <Anchor href="#">JORGE UBALDO COLIN PESCINA </Anchor>
                    </li>
                    <li>
                      <Anchor href="#">
                        JORGE UBALDO COLIN PESCINA (MAIN)
                      </Anchor>
                    </li>
                  </ul>
                </p>
              </Panel>
            </Collapse>
          </div>
        </div>
      </Sider>
    );
  }
}

export default Profile;
