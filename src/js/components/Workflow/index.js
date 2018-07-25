import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row, Col, Button, Dropdown, Menu, Tooltip } from "antd";
import WorkflowList from "./workflow-list";
import {
  workflowActions,
  workflowFiltersActions,
  configActions
} from "../../actions";
import FilterSidebar from "./filter";
import { baseUrl2, authHeader } from "../../_helpers";
import WorkflowFilterTop from "./filter-top";
import _ from "lodash";

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      workflowId: null,
      showWaitingFitler: false,
      isUserAuthenticated: false
    };
  }

  componentDidMount = () => {
    //this.reloadWorkflowList();
    if (!this.props.config.configuration || this.props.config.error) {
      this.props.dispatch(configActions.getConfig());
    }

    if (this.props.authentication.user) {
      if (this.isUserAuthenticated()) {
        this.setState({ isUserAuthenticated: true });
      }
    }
  };

  componentDidUpdate = prevProps => {
    if (
      this.props.workflowKind.workflowKind !==
      prevProps.workflowKind.workflowKind
    ) {
      if (this.props.workflowKind.workflowKind) {
        if (this.props.config.loading) {
        } else if (
          !this.props.config.loading &&
          this.props.config.configuration
        ) {
          this.getDefaultKind(true);
        }
      }
    }

    /*//////////////////////////////////////////////////
      When filter is change workflow is reloaded/fetched and by 
      default we set workflow kind filter that makes an extra call
      for workflow fetch so  by removing this call we reduced the 
      extra call for workflow fetch thus reducing time to load
    */ ////////////////////////////////////////////////////

    // if (this.props.workflowFilters.kind !== prevProps.workflowFilters.kind ) {
    //     this.reloadWorkflowList();
    // }
  };

  getDefaultKind = config_loaded => {
    let kindList = this.props.workflowKind.workflowKind;
    let kindId = 2;
    let defKind = null;

    if (config_loaded) {
      kindId = this.props.config.configuration.default_workflow_kind;
    } else {
      kindId = kindList[0].id;
    }

    if (kindId) {
      _.map(kindList, function(kind) {
        if (kind.id === parseInt(kindId, 10)) {
          defKind = kind;
        }
      });
    } else {
      defKind = kindList[0];
    }

    if (defKind) {
      this.setState({ defKind: defKind });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "kind",
          filterValue: [defKind.id],
          meta: defKind
        })
      );
    } else {
      this.reloadWorkflowList();
    }
  };

  reloadWorkflowList = () => {
    this.props.dispatch(workflowActions.getAll());
  };

  getExportList = () => {
    let kind = this.props.workflowKind.workflowKind;
    return (
      <Menu>
        {_.map(kind, function(item, index) {
          return (
            <Menu.Item key={index}>
              <a
                href={baseUrl2 + "workflow-kinds/" + item.tag + "/data-export/"}
              >
                <i
                  className="material-icons text-primary-dark"
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

  loadExportList = () => {
    console.log("lodad");
  };

  isUserAuthenticated = () => {
    let pass = false;
    let currentUser = this.props.authentication.user.id;

    switch (currentUser) {
      case 11:
        pass = true;
        break;
      case 10:
        pass = true;
        break;
      case 13:
        pass = true;
        break;
      case 2:
        pass = true;
        break;
      case 228:
        pass = true;
        break;
      default:
        pass = false;
    }
    return pass;
  };

  render = () => {
    return (
      <Layout className="workflow-container inner-container" hasSider={false}>
        <FilterSidebar />

        <Layout
          style={{ marginLeft: 250, minHeight: "100vh" }}
          hasSider={false}
        >
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
                {this.state.isUserAuthenticated ? (
                  <Tooltip title={"Export workflow data"}>
                    <Dropdown
                      overlay={this.getExportList()}
                      trigger="click"
                      onClick={this.loadExportList}
                    >
                      <span className="pd-ard-sm text-light text-anchor">
                        <i className="material-icons">save_alt</i>
                      </span>
                    </Dropdown>
                  </Tooltip>
                ) : null}
              </Col>
            </Row>
          </div>

          <div
            className={
              "waiting-filter-warpper animated " +
              (this.state.showWaitingFitler ? " grow " : " shrink")
            }
          >
            {this.state.defKind ? <WorkflowFilterTop {...this.props} /> : null}
          </div>

          <div className="divider-top" />

          {this.props.workflow.loading ? null : (
            <div className="workflow-count">
              {this.props.workflow.count} Workflows
            </div>
          )}

          {this.props.config.loading ||
          this.props.workflow.loading ||
          this.props.workflowKind.loading ? (
            <div className="text-center text-bold mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
              <span className="text-normal pd-left">
                {" "}
                {this.props.config.loading
                  ? "Loading configurations..."
                  : this.props.workflowKind.loading
                    ? "Loading filters..."
                    : this.props.workflow.loading ? "Fetching data..." : null}
              </span>
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
  const {
    config,
    workflowFilters,
    workflow,
    authentication,
    workflowKind
  } = state;
  return {
    config,
    workflow,
    workflowFilters,
    workflowKind,
    authentication
  };
}

export default connect(mapStateToProps)(Workflow);
