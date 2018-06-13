import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Button,
  Dropdown,
  Badge,
  Popover,
  List
} from "antd";
import logo from "../../../images/client-logo/mck.png";
import { workflowKindActions, createWorkflow } from "../../actions";
import {} from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";

const { Header } = Layout;

const content = (
  <div className="" style={{ maxWidth: "300px", maxHeight: "500px" }}>
    <List itemLayout="vertical" size="small">
      <List.Item key="1">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Data pull for Step</a>}
          description="'Detailed Company Profile' was initiated by Vetted Bot"
        />
        <div className="text-right text-light small">4 days ago</div>
      </List.Item>

      <List.Item key="2">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step:</a>}
          description="'D&B Select Company' was completed by palak abrol"
        />
        <div className="text-right text-light small">4 days ago</div>
      </List.Item>

      <List.Item key="3">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step</a>}
          description="' Adverse Media' was initiated by Vetted Bot"
        />
        <div className="text-right text-light small">1 week ago</div>
      </List.Item>

      <List.Item key="4">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step</a>}
          description="'' Adverse Media' was completed by VETTED bot as value of no. of hits is '0' which is equals to '0' "
        />
        <div className="text-right text-light small">1 week ago</div>
      </List.Item>

      <List.Item key="5">
        <List.Item.Meta
          avatar={<i className="material-icons text-primary">check_circle</i>}
          title={<a href="">Step</a>}
          description="' Prohibited List Check' was completed by palak abrol"
        />
        <div className="text-right text-light small">1 week ago</div>
      </List.Item>
    </List>
  </div>
);

class NavTop extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.loadWorkflowKind();
  };

  loadWorkflowKind = () => {
    this.props.dispatch(workflowKindActions.getAll());
  };

  clicked = tag => {
    //dispatch
    let payload = {
      status: 1,
      kind: tag,
      name: "Draft"
    };
    this.props.dispatch(createWorkflow(payload));
  };

  render = () => {
    let that = this;
    const { workflowKind } = this.props.workflowKind;

    //workflow Kind list
    const menu = (
      <Menu>
        {_.map(workflowKind, function(item, index) {
          return (
            <Menu.Item
              key={"key-" + index}
              className="text-primary text-medium"
            >
              <span onClick={that.clicked.bind(this, item.tag)}>
                <i className="material-icons t-14 pd-right-sm">{item.icon}</i>{" "}
                {item.name}
              </span>
            </Menu.Item>
          );
        })}

        {this.props.workflowKind.error ? (
          <Menu.Item key="1" className="text-primary text-medium">
            <span onClick={that.loadWorkflowKind}>
              <i className="material-icons t-14 pd-right-sm">refresh</i> Reload
            </span>
          </Menu.Item>
        ) : null}

        {_.isEmpty(this.props.workflowKind.workflowKind) ? (
          <Menu.Item key="1" className="text-grey text-medium" disabled>
            <span>
              <i className="material-icons t-14 pd-right-sm">error</i> Empty
            </span>
          </Menu.Item>
        ) : (
          ""
        )}
      </Menu>
    );

    return (
      <div>
        <div className="container navbar-top" id="navbar-top">
          <Header
            className="ant-nav"
            style={{
              background: "#fff",
              position: "fixed",
              width: "100%",
              left: 0,
              zIndex: 2,
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.09)"
            }}
          >
            <span className="logo" style={{ float: "left" }}>
              <img alt="mckinsey logo" src={logo} height="60" />
            </span>

            <Menu
              theme="light"
              mode="horizontal"
              style={{ lineHeight: "64px", float: "right" }}
            >
              <Menu.Item key="2">
                <Popover
                  placement="bottomRight"
                  title={"Notifications"}
                  content={content}
                  trigger="click"
                >
                  <Badge count={5}>
                    <i className="material-icons text-primary text-middle">
                      notifications
                    </i>
                  </Badge>
                </Popover>
              </Menu.Item>
            </Menu>

            <span className="float-right mr-right">
              <Dropdown overlay={menu} placement="bottomRight">
                <Button
                  type="primary"
                  size="default"
                  loading={this.props.workflowKind.loading}
                  className="shadow-2"
                >
                  + Create <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          </Header>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { workflowKind, authentication } = state;
  return {
    workflowKind,
    authentication
  };
}

export default connect(mapStateToProps)(NavTop);
