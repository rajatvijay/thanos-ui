import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row, Col, Button, Dropdown, Menu } from "antd";
import WorkflowList from "./workflow-list";
import { workflowActions } from "../../actions";
import FilterSidebar from "./filter";
import WorkflowFilterTop from "./filter-top";
import _ from "lodash";

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = { sidebar: false, workflowId: null, showWaitingFitler: false };
  }

  componentDidMount = () => {
    this.reloadWorkflowList();
  };

  reloadWorkflowList = () => {
    this.props.dispatch(workflowActions.getAll());
  };

  // callBackCollapser = () => {
  //   this.setState({ sidebar: !this.state.sidebar });
  // };

  getExportList = () => {
    let kind = this.props.workflowKind.workflowKind;
    return (
      <Menu>
        {_.map(kind, function(item, index) {
          return (
            <Menu.Item key={index}>
              <a
                href={
                  "http://vetted.slackcart.com/api/v1/workflow-kinds/" +
                  item.tag +
                  "/data-export/"
                }
              >
                <i
                  className="material-icons"
                  style={{
                    width: "20px",
                    fontSize: "14px",
                    verticalAlign: "middle"
                  }}
                >
                  {item.icon}
                </i>
                {item.name}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  toggleWaitingFilter = () => {
    this.setState({ showWaitingFitler: !this.state.showWaitingFitler });
  };

  render = () => {
    // let kind = this.props.workflowKind.workflowKind;
    // let kindMenu = <Menu>{_.map(kind, function(item, index){
    //       return <Menu.Item key={index}>
    //         <a href={"http://vetted.slackcart.com/api/v1/workflow-kinds/" +item.tag +"/data-export/"}>{item.name}</a>
    //       </Menu.Item>
    //     })}
    // </Menu>

    return (
      <Layout className="workflow-container inner-container">
        <FilterSidebar />

        <Layout style={{ marginLeft: 250, minHeight: "100vh" }}>
          <div className="section-top ">
            <Row>
              <Col span="12" className="waiting-section">
                <span
                  className="waiting-filter-trigger text-anchor"
                  onClick={this.toggleWaitingFilter}
                >
                  Waiting on{" "}
                  <i className="material-icons">
                    {this.state.showWaitingFitler
                      ? "keyboard_arrow_down"
                      : "keyboard_arrow_up"}
                  </i>
                </span>
              </Col>
              <Col span="12" className="text-right export-section">
                <Dropdown overlay={this.getExportList()}>
                  <Button className="main-btn">
                    <i className="material-icons">save_alt</i>
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </div>

          <div
            className={
              "waiting-filter-warpper animated " +
              (this.state.showWaitingFitler ? " grow " : " shrink")
            }
          >
            {this.props.workflowFilters.kind.filterValue !== null ? (
              <WorkflowFilterTop {...this.props} />
            ) : null}
          </div>

          {this.props.workflow.loading ? (
            <div className="text-center text-bold mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
            </div>
          ) : this.props.workflow.loadingStatus === "failed" ? (
            <div className="mr-top-lg text-center text-bold text-metal">
              Unable to load workflow list.{" "}
              <div className="text-anchor " onClick={this.reloadWorkflowList}>
                Click here to reload{" "}
                <i className="material-icons text-middle">refresh</i>
              </div>
            </div>
          ) : (
            <div className="clearfix">
              {/*<div className="filter-section mr-top-lg mr-left-lg clearfix">
                <Button
                  type={this.state.sidebar ? "primary" : "default"}
                  className="constom button anchor"
                  onClick={this.callBackCollapser}
                >
                  Custom filter
                </Button>
              </div>*/}

              <WorkflowList profile={this.props.match} {...this.props} />
              {/*<Filter2
                sidebar={this.state.sidebar}
                toggleSidebar={this.callBackCollapser}
              />
              */}
            </div>
          )}
        </Layout>
      </Layout>
    );
  };
}

function mapStateToProps(state) {
  const { workflowFilters, workflow, authentication, workflowKind } = state;
  return {
    workflow,
    workflowFilters,
    workflowKind,
    authentication
  };
}

export default connect(mapStateToProps)(Workflow);
