import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Layout,
  Icon,
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
  Tooltip,
  Drawer,
  Switch
} from "antd";
import WorkflowList from "./workflow-list";
import {
  workflowActions,
  workflowFiltersActions,
  configActions,
  logout,
  checkAuth
} from "../../actions";
import FilterSidebar from "./filter";
import { baseUrl2, authHeader } from "../../_helpers";
import WorkflowFilterTop from "./filter-top";
import _ from "lodash";
import { veryfiyClient } from "../../utils/verification";
import MetaGraph from "./MetaGraph";

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      workflowId: null,
      showWaitingFitler: false,
      isUserAuthenticated: false,
      statusView: true,
      visible: false
    };

    if (!this.props.users.me) {
      this.checkAuth();
    }

    if (
      !this.props.config.configuration ||
      this.props.config.error ||
      this.props.config.permissions
    ) {
      this.props.dispatch(configActions.getConfig());
    }

    if (!this.props.users.me || this.props.users.me.error) {
      if (!veryfiyClient(this.props.authentication.user.csrf)) {
        this.props.dispatch(logout());
      }
    }
  }

  componentDidMount = () => {
    //this.reloadWorkflowList();
    if (!_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
      this.setState({ defKind: true });
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

  redirectLoginPage = () => {
    this.props.dispatch(logout());
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

  toggleListView = status => {
    this.setState({ statusView: status });
  };

  checkAuth = () => {
    this.props.dispatch(checkAuth());
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render = () => {
    let showInsights = false;
    if (_.includes(this.props.authentication.user.features, "add_workflow")) {
      showInsights = true;
    }

    return (
      <Layout className="workflow-container inner-container" hasSider={false}>
        <FilterSidebar />

        <Layout
          style={{ marginLeft: 250, minHeight: "100vh" }}
          hasSider={false}
        >
          <div className="section-top ">
            <div>
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
                  {showInsights ? (
                    <Tooltip title={"Insight"}>
                      <span className="pd-ard-sm" onClick={this.showDrawer}>
                        <i className="material-icons text-light text-anchor t-18 ">
                          trending_up
                        </i>
                      </span>
                    </Tooltip>
                  ) : null}

                  {_.includes(
                    this.props.config.permissions,
                    "Can export workflow data"
                  ) ? (
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
              <div
                className={
                  "waiting-filter-warpper animated " +
                  (this.state.showWaitingFitler ? " grow " : " shrink")
                }
              >
                {this.state.defKind ? (
                  <WorkflowFilterTop {...this.props} />
                ) : null}
              </div>
            </div>
          </div>

          {this.props.workflow.loading ? null : this.props.workflow
            .loadingStatus === "failed" ? null : (
            <Row className="list-view-header">
              <Col span="12">
                <div className="workflow-count">
                  {this.props.workflow.count} Workflows
                </div>
              </Col>
              <Col span="12">
                <div className="text-right list-toggle-btn">
                  <span className="pd-right t-14">Details view</span>
                  <Switch defaultChecked onChange={this.toggleListView} />
                  <span className="pd-left  t-14">Workflow view</span>
                </div>
              </Col>
            </Row>
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
              {/**<div className="text-anchor ">
                 Click here to reload{" "}
                 <i className="material-icons text-middle">refresh</i>
               </div>**/}
              <div className="mr-top-lg text-center text-bold text-metal">
                You have been logged out. Please Login again to continue
                <div
                  className="text-anchor text-anchor "
                  onClick={this.redirectLoginPage}
                >
                  Click here to Login
                </div>
              </div>
            </div>
          ) : (
            <div className="clearfix">
              <WorkflowList
                profile={this.props.match}
                {...this.props}
                statusView={this.state.statusView}
              />
            </div>
          )}
          <Drawer
            width={600}
            title="Insight"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <MetaGraph />
          </Drawer>
        </Layout>
      </Layout>
    );
  };
}

function mapStateToProps(state) {
  const {
    config,
    workflow,
    authentication,
    workflowKind,
    workflowGroupCount,
    users
  } = state;
  return {
    config,
    workflow,
    workflowKind,
    authentication,
    workflowGroupCount,
    users
  };
}

export default connect(mapStateToProps)(Workflow);
