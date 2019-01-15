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
  Switch,
  Tooltip
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
import AlertFilter from "./AlertFilter";
import _ from "lodash";
import { veryfiyClient } from "../../utils/verification";
import { FormattedMessage } from "react-intl";

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      workflowId: null,
      showWaitingFitler: false,
      isUserAuthenticated: false,
      statusView: true,
      visible: false,
      sortOrderAsc: true
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

  changeScoreOrder = order => {
    let sort = this.state.sortOrderAsc
      ? "-sorting_primary_field"
      : "sorting_primary_field";
    let payload = { filterType: "ordering", filterValue: [sort] };
    this.setState({ sortOrderAsc: !this.state.sortOrderAsc });
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  render = () => {
    let showRisk = false;
    if (
      _.size(this.props.workflow.workflow) &&
      this.props.workflow.workflow[0].sorting_primary_field
    ) {
      showRisk = true;
    }

    return (
      <Layout className="workflow-container inner-container" hasSider={false}>
        <FilterSidebar />

        <Layout
          style={{ marginLeft: 320, minHeight: "100vh" }}
          hasSider={false}
        >
          <div className="section-top">
            <div
              className={
                "waiting-filter-warpper animated " +
                (this.state.showWaitingFitler ? " grow " : " shrink")
              }
            >
              {this.state.defKind ? <AlertFilter {...this.props} /> : null}
            </div>
          </div>

          {this.props.workflow.loading ? null : this.props.workflow
            .loadingStatus === "failed" ? null : (

            <Row className="list-view-header t-14 ">
              <Col span="7">
                <div className="workflow-count text-metal">
                  {this.props.workflow.count} <FormattedMessage id="workflowsInstances.workflowsCount" />
                </div>
              </Col>
              <Col span="11" className="text-metal">
                <span style={{ paddingLeft: "16px" }}>
                  <FormattedMessage id="workflowsInstances.stepGroupName" />
                </span>
              </Col>
              <Col span="2" className="text-secondary text-center">
                {showRisk ? (
                  <Tooltip
                    title={
                      this.state.sortOrderAsc
                        ? "High to low risk score"
                        : "Low to high risk score"
                    }
                  >
                    <span
                      className="text-secondary text-anchor"
                      onClick={this.changeScoreOrder}
                    >
                      Risk
                      <i className="material-icons t-14  text-middle">
                        {this.state.sortOrderAsc
                          ? "keyboard_arrow_up"
                          : "keyboard_arrow_down"}
                      </i>
                    </span>
                  </Tooltip>
                ) : null}
              </Col>
              <Col span="4" className="text-secondary text-center">
                <FormattedMessage id="workflowsInstances.statusText" />
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
              <FormattedMessage id="errorMessageInstances.noWorkflowsError" />.{" "}
              {/**<div className="text-anchor ">
                 Click here to reload{" "}
                 <i className="material-icons text-middle">refresh</i>
               </div>**/}
              <div className="mr-top-lg text-center text-bold text-metal">
                <FormattedMessage id="workflowsInstances.loggedOutError" />
                <div
                  className="text-anchor text-anchor "
                  onClick={this.redirectLoginPage}
                >
                  <FormattedMessage id="workflowsInstances.clickToLogin" />
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

export default connect(mapStateToProps)(injectIntl(Workflow));
