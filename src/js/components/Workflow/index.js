import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
  Tooltip,
  Tabs
} from "antd";
import WorkflowList from "./workflow-list";
import {
  workflowActions,
  workflowFiltersActions,
  configActions,
  logout,
  checkAuth,
  workflowKindActions
} from "../../actions";
import FilterSidebar from "./filter";
import { authHeader } from "../../_helpers";
import AlertFilter from "./AlertFilter";
import WorkflowFilterTop from "./WorkflowFilterTop";
import _ from "lodash";
import { veryfiyClient } from "../../utils/verification";
import { FormattedMessage, injectIntl } from "react-intl";
import Sidebar from "../../modules/components/common/sidebar/Sidebar";

import Filter from "../../modules/components/common/filter/Filter";

const { Header, Content, Footer, Sider } = Layout;

const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      workflowId: null,
      showWaitingFitler: false,
      statusView: true,
      visible: false,
      sortOrderAsc: false,
      sortingEnabled: false
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
    console.log(this.props.workflowFilters);
    let tag = this.props.workflowFilters.kind.meta.tag;

    if (!_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
      this.setState({ defKind: true });
    }

    if (this.props.workflowKind.workflowKind) {
      this.getDefaultKind();
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
      this.props.dispatch(workflowKindActions.getAlertCount(defKind.tag));
      if (_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
        this.props.dispatch(workflowKindActions.getCount(defKind.tag));
        this.props.dispatch(workflowKindActions.getStatusCount(defKind.tag));
      }
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
    const isAscending = this.state.sortOrderAsc;
    const isSortingEnabled = this.state.sortingEnabled;
    if (!isSortingEnabled) {
      // Enable the sroting in descending mode
      this.setState({
        sortOrderAsc: false,
        sortingEnabled: true
      });
      return this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: ["-sorting_primary_field"]
        })
      );
    }

    if (isAscending) {
      // Disable the sorting
      this.setState({ sortingEnabled: false });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: []
        })
      );
    } else {
      // Enable sorting in the ascending mode
      this.setState({
        sortOrderAsc: true,
        sortingEnabled: true
      });
      this.props.dispatch(
        workflowFiltersActions.setFilters({
          filterType: "ordering",
          filterValue: ["sorting_primary_field"]
        })
      );
    }
  };

  render = () => {
    const { sortingEnabled } = this.state;
    if (this.props.workflow.loadingStatus === "failed") {
      // TODO the checkAuth method only reports status text: `403 Forbidden`
      // In future, we should relook at a better way to handle this
      if (this.props.users.me && this.props.users.me.error == "Forbidden") {
        this.props.dispatch(logout());
        return;
      }
    }

    return (
      <Layout
        className="workflow-container inner-container"
        style={{ minHeight: "100vh" }}
      >
        <FilterSidebar />
        <Sidebar {...this.props} />
        <Layout>
          <Content style={{ margin: "0 26px" }}>
            <Row className="clear">
              <Filter />

              {this.props.config.loading ||
              this.props.workflow.loading ||
              this.props.workflowKind.loading ? (
                <div className="text-center text-bold mr-top-lg">
                  <Icon type="loading" style={{ fontSize: 24 }} />
                  <span className="text-normal pd-left">
                    {" "}
                    <FormattedMessage
                      id={
                        this.props.config.loading
                          ? "workflowsInstances.loadingConfigsText"
                          : this.props.workflowKind.loading
                            ? "workflowsInstances.loadingFiltersText"
                            : this.props.workflow.loading
                              ? "workflowsInstances.fetchingDataText"
                              : null
                      }
                    />
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
                    <FormattedMessage id="errorMessageInstances.loggedOutError" />
                    <div
                      className="text-anchor text-anchor "
                      onClick={this.redirectLoginPage}
                    >
                      <FormattedMessage id="commonTextInstances.clickToLogin" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="clearfix">
                  <WorkflowList
                    sortAscending={this.state.sortOrderAsc}
                    profile={this.props.match}
                    {...this.props}
                    statusView={this.state.statusView}
                    sortingEnabled={this.state.sortingEnabled}
                  />
                </div>
              )}
            </Row>
          </Content>
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
    workflowAlertGroupCount,
    users,
    nextUrl,
    workflowFilters
  } = state;
  return {
    config,
    workflow,
    workflowKind,
    authentication,
    workflowAlertGroupCount,
    workflowGroupCount,
    users,
    nextUrl,
    workflowFilters
  };
}

export default connect(mapStateToProps)(injectIntl(Workflow));
