import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Row } from "antd";
import WorkflowList from "./workflow-list";
import {
  workflowActions,
  workflowFiltersActions,
  logout,
  checkAuth,
  workflowKindActions
} from "../../actions";
import _ from "lodash";
import { veryfiyClient } from "../../utils/verification";
import { FormattedMessage, injectIntl } from "react-intl";
import Sidebar from "../../../modules/sidebar/components/Sidebar";
import Filter from "../../../modules/filter/components/Filter";
import { Chowkidaar } from "../../../modules/common/permissions/Chowkidaar";
import Permissions from "../../../modules/common/permissions/constants";

const { Content } = Layout;

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

    if (!this.props.users.me || this.props.users.me.error) {
      if (!veryfiyClient(this.props.authentication.user.csrf)) {
        this.props.dispatch(logout());
      }
    }
  }

  componentDidMount = () => {
    this.props.dispatch(workflowKindActions.getAll());
    this.props.dispatch(workflowFiltersActions.getStatusData());
    this.props.dispatch(workflowFiltersActions.getRegionData());
    this.props.dispatch(workflowFiltersActions.getBusinessUnitData());
    if (!_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
      this.setState({ defKind: true });
    }

    if (this.props.workflowKind.workflowKind) {
      this.getDefaultKind();
    }

    this.props.dispatch(workflowActions.expandedWorkflowsList([]));
  };

  componentDidUpdate = prevProps => {
    if (this.props.workflowFilters !== prevProps.workflowFilters) {
      this.props.dispatch(workflowActions.getAll());
    }

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
  };

  getDefaultKind = config_loaded => {
    const kindList = this.props.workflowKind.workflowKind;
    let defKind = null;

    defKind = kindList[0];

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

  showMessage = (isLoading, loadingText) => {
    let message = null;
    if (isLoading) {
      message = (
        <div className="text-center text-bold mr-top-lg">
          <Icon type="loading" style={{ fontSize: 24 }} />
          <span className="text-normal pd-left">
            {" "}
            <FormattedMessage id={loadingText} />
          </span>
        </div>
      );
    } else if (this.props.workflow.loadingStatus === "failed") {
      message = (
        <div className="mr-top-lg text-center text-bold text-metal">
          <FormattedMessage id="errorMessageInstances.noWorkflowsError" />.{" "}
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
      );
    }

    return message;
  };

  render = () => {
    const { workflow, config, workflowKind } = this.props;

    if (this.props.workflow.loadingStatus === "failed") {
      // TODO the checkAuth method only reports status text: `403 Forbidden`
      // In future, we should relook at a better way to handle this
      if (this.props.users.me && this.props.users.me.error === "Forbidden") {
        this.props.dispatch(logout());
        return;
      }
    }

    const renderPrep = {
      get isLoading() {
        return config.loading || workflow.loading || workflowKind.loading;
      },

      get getLoadingText() {
        let text = null;
        if (config.loading) text = "workflowsInstances.loadingConfigsText";
        else if (workflowKind.loading)
          text = "workflowsInstances.loadingFiltersText";
        else if (workflow.loading) text = "workflowsInstances.fetchingDataText";
        return text;
      },

      get notAllowedMessage() {
        return (
          <div style={{ paddingTop: "150px" }}>
            <h4 className="text-center t-24 text-bold">
              {!config ? (
                "loading"
              ) : (
                <FormattedMessage id={"workflowsInstances.unauthorisedText"} />
              )}
            </h4>
          </div>
        );
      }
    };

    const renderMessage = this.showMessage(
      renderPrep.isLoading,
      renderPrep.getLoadingText
    );

    return (
      <Chowkidaar
        check={Permissions.CAN_VIEW_DASHBOARD}
        deniedElement={renderPrep.notAllowedMessage}
      >
        <Layout
          className="workflow-container inner-container"
          style={{ minHeight: "100vh" }}
        >
          <Sidebar {...this.props} />
          <Layout>
            <Content style={{ margin: "4vh 4vw" }}>
              <Row className="clear">
                <Filter />

                {renderMessage || (
                  <div className="clearfix">
                    <WorkflowList
                      location={this.props.location}
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
      </Chowkidaar>
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
