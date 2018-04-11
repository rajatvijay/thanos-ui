import React, { Component } from "react";
import { Layout, Menu, Icon, Button, Dropdown } from "antd";
import logo from "../../../images/client-logo/mck.png";
import { workflowKindActions, createWorkflow } from "../../actions";
import {} from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";

const { Header } = Layout;

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

  clicked = id => {
    //dispatch
    let payload = {
      definition: null,
      created_by: this.props.authentication.user.id,
      status: 1,
      kind: id,
      name: "Draft"
    };
    this.props.dispatch(createWorkflow(payload));
  };

  render = () => {
    let that = this;
    const { workflowKind } = this.props.workflowKind;

    const menu = (
      <Menu>
        {_.map(workflowKind, function(item) {
          return (
            <Menu.Item key="1" className="text-primary text-medium">
              <span onClick={that.clicked.bind(this, item.id)}>
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
      </Menu>
    );

    return (
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
              <Icon type="notification" />
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="area-chart" />
            </Menu.Item>
          </Menu>
          <span className="float-right">
            <Dropdown overlay={menu} placement="bottomRight">
              <Button
                type="primary"
                size="small"
                loading={this.props.workflowKind.loading}
              >
                + Create <Icon type="down" />
              </Button>
            </Dropdown>
          </span>
        </Header>
      </div>
    );
  };
}

function mapStateToProps(state) {
  console.log(state);
  const { workflowKind, authentication } = state;
  return {
    workflowKind,
    authentication
  };
}

export default connect(mapStateToProps)(NavTop);
