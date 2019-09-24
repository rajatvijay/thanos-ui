import React, { Component } from "react";
import { Divider, Drawer, Dropdown, Icon, Menu, Modal } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import ServerlessAuditListTabs from "../../../../js/components/Navbar/ServerlessAuditListTabs";
import AuditListTabs from "../../../../js/components/Navbar/audit_log";
import {
  workflowDetailsActions,
  workflowStepActions
} from "../../../../js/actions";
import { Chowkidaar } from "../../../common/permissions/Chowkidaar";
import Permissions from "../../../common/permissions/permissionsList";
import {
  StyledSidebarHeader,
  StyledWorkflowName,
  StyledCollapseItem,
  StyledSidebar
} from "../styledComponents";
import StepsSideBar from "./StepsSidebar";
import LCData from "./LCData";
import { get as lodashGet } from "lodash";
import { css } from "emotion";
import { getFilteredStepGroups } from "../sidebar.selectors";
import Breadcrums from "./Breadcrums";

const confirm = Modal.confirm;

class Sidebar extends Component {
  state = {
    showActivitySidebar: false,
    isWorkflowPDFModalVisible: false,
    selectedPanel: this.props.selectedGroup
  };

  toggleActivitySidebar = () => {
    this.setState(({ showActivitySidebar }) => ({
      showActivitySidebar: !showActivitySidebar
    }));
  };

  // ================================================================ //
  // ================================================================ //
  // ================================================================ //
  // ================================================================ //

  // DIRTY CODE, SORRY!!
  callBackCollapser = (objectId, content_type) => {
    this.props.dispatch(
      workflowDetailsActions.getComment(objectId, content_type)
    );
  };

  addComment = (payload, step_reload_payload) => {
    this.props.dispatch(
      workflowStepActions.addComment(payload, step_reload_payload)
    );
  };

  getComment = objectId => {
    this.addComment(objectId, "workflow");
  };

  openCommentSidebar = () => {
    const { workflowIdFromDetailsToSidebar } = this.props;
    const objectId = this.props.workflowDetailsHeader[
      workflowIdFromDetailsToSidebar
    ].id;
    this.callBackCollapser(objectId, "all_data");
  };

  // DIRTY CODE ENDS HERE!
  // ================================================================ //
  // ================================================================ //
  // ================================================================ //
  // ================================================================ //

  printDiv = () => {
    setTimeout(function() {
      const printContents = document.getElementById("StepBody").innerHTML;
      const docHead = document.querySelector("head").innerHTML;

      const body = `
      <!DOCTYPE html>
      <html>
        <head>${docHead}</head>
        <body>${printContents}</body>
      </html>
      `;
      const printWindow = window.open();
      printWindow.document.write(body);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(function() {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }, 500);
  };

  toggleWorkflowPDFModal = () => {
    this.setState(state => ({
      isWorkflowPDFModalVisible: !state.isWorkflowPDFModalVisible
    }));
  };

  archiveWorkflow = () => {
    const { intl, dispatch, workflowIdFromDetailsToSidebar } = this.props;
    confirm({
      title: intl.formatMessage({
        id: "commonTextInstances.archiveConfirmText"
      }),
      content: intl.formatMessage({
        id: "commonTextInstances.archiveConfirmContent"
      }),
      onOk() {
        dispatch(
          workflowDetailsActions.archiveWorkflow(workflowIdFromDetailsToSidebar)
        );
      },
      onCancel() {}
    });
  };

  handleStepClick = (groupid, stepid) => {
    this.props.onUpdateOfActiveStep(groupid, stepid);
  };

  onChangeOfCollapse = panelId => {
    this.setState({ selectedPanel: String(panelId) });
  };

  onProfileClick = () => {
    this.props.changeProfileDisplay(true);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.selectedGroup !== this.props.selectedGroup) {
      this.setState({ selectedPanel: this.props.selectedGroup });
    }
  }

  // TODO: Convert them into selectors later
  // ALL GETTERS

  get currentWorkflow() {
    const { workflowIdFromDetailsToSidebar } = this.props;
    return lodashGet(
      this.props,
      `workflowDetailsHeader[${workflowIdFromDetailsToSidebar}]`,
      null
    );
  }

  get workflowFamily() {
    const family = lodashGet(this.currentWorkflow, `workflow_family`, null);

    // Removing the last element since it will always be the workflow itself
    const familyCopy = [...family];
    familyCopy.pop();

    return familyCopy.length ? familyCopy : null;
  }

  get lcData() {
    const lcData = lodashGet(this.currentWorkflow, `lc_data`, []);
    const visibelLcData = lcData.filter(
      lc => lc.display_type === "normal" && lc.value
    );
    return visibelLcData;
  }

  get currentWorkflowName() {
    return lodashGet(this.currentWorkflow, "name", null);
  }

  get childWorkflows() {
    return lodashGet(this.currentWorkflow, "children", []);
  }

  get workflowStatus() {
    return (
      lodashGet(this.currentWorkflow, "status.label", null) ||
      lodashGet(this.currentWorkflow, "status.kind_display", null)
    );
  }

  get loadingSteps() {
    const { workflowIdFromDetailsToSidebar } = this.props;
    return lodashGet(
      this.props,
      `workflowDetails.[${workflowIdFromDetailsToSidebar}].loading`,
      null
    );
  }

  // ALL RENDER FUNCTIONS
  renderActivitySidebar = () => {
    const { showActivitySidebar } = this.state;
    const { workflowIdFromDetailsToSidebar } = this.props;
    const childWorkflowIds = this.childWorkflows.map(({ id }) => id);
    // TODO: Check why this is required?
    if (!showActivitySidebar) return null;
    return (
      <Drawer
        title="Activity log"
        placement="right"
        closable={true}
        onClose={this.toggleActivitySidebar}
        visible={showActivitySidebar}
        width={500}
        className="activity-log-drawer"
      >
        {process.env.REACT_APP_ACTIVITY_LOG_SERVERLESS === "true" ? (
          <ServerlessAuditListTabs
            id={[...childWorkflowIds, workflowIdFromDetailsToSidebar]}
          />
        ) : (
          <AuditListTabs id={workflowIdFromDetailsToSidebar} />
        )}
      </Drawer>
    );
  };

  renderSidebarHeader = () => {
    return (
      <StyledSidebarHeader>
        <div
          className={css`
            max-width: calc(100% - 40px);
            line-height: normal;
          `}
        >
          <Breadcrums workflowFamily={this.workflowFamily} />
          <br />
          <StyledWorkflowName>{this.currentWorkflowName}</StyledWorkflowName>
        </div>
        <Dropdown
          overlay={this.workflowActionMenu}
          className="child-workflow-dropdown"
          trigger={["click", "hover"]}
        >
          <span className="pd-ard-sm text-metal text-anchor">
            <i className="material-icons text-middle t-18 ">more_vert</i>
          </span>
        </Dropdown>
      </StyledSidebarHeader>
    );
  };

  renderLCData = () => {
    return (
      <Chowkidaar check={Permissions.CAN_VIEW_WORKFLOW_PROFILE}>
        <LCData
          // TODO: Optimization required
          lcData={[...this.lcData].splice(0, 3)}
          status={this.workflowStatus}
          style={{ marginBottom: 15 }}
        />
      </Chowkidaar>
    );
  };

  renderProfileStep = () => {
    const { selectedGroup } = this.props;
    const profileSelected = selectedGroup === null;
    return (
      <>
        <StyledCollapseItem
          onClick={this.onProfileClick}
          selected={profileSelected}
          data-testid="profile-step"
        >
          <i
            className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
            fill="#FFF"
            style={{
              color: profileSelected ? "white" : "rgb(204, 204, 204)",
              fontSize: 24
            }}
          >
            info_outline
          </i>
          <FormattedMessage id="workflowsInstances.profileText" />
        </StyledCollapseItem>
        <Divider
          style={{ margin: 0, marginTop: "12px", backgroundColor: "#d9d9d9" }}
        />
      </>
    );
  };

  renderLoader = () => {
    return (
      <Icon
        type="loading"
        spin
        className={css`
          font-size: 36px;
          margin-top: 20px;
          margin: 20px auto;
          display: block;
        `}
      />
    );
  };

  workflowActionMenu = (
    <Menu>
      <Chowkidaar check={Permissions.CAN_VIEW_ACTIVITY_LOG}>
        <Menu.Item key={"activity"} onClick={this.toggleActivitySidebar}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              restore
            </i>{" "}
            <FormattedMessage id="workflowsInstances.viewActivityLog" />
          </span>
        </Menu.Item>
      </Chowkidaar>

      <Menu.Item key={"message"} onClick={this.openCommentSidebar}>
        <span>
          <i className="material-icons t-18 text-middle pd-right-sm">
            chat_bubble
          </i>{" "}
          <FormattedMessage id="stepBodyFormInstances.viewComments" />
        </span>
      </Menu.Item>

      <Menu.Item key={"pint"} onClick={this.printDiv}>
        <span>
          <i className="material-icons t-18 text-middle pd-right-sm">print</i>{" "}
          <FormattedMessage id="stepBodyFormInstances.printText" />
        </span>
      </Menu.Item>

      <Chowkidaar check={Permissions.CAN_ARCHIVE_WORKFLOWS}>
        <Menu.Item key={"archive"} onClick={this.archiveWorkflow}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              archive
            </i>{" "}
            <FormattedMessage id="stepBodyFormInstances.archiveWorkflow" />
          </span>
        </Menu.Item>
      </Chowkidaar>
    </Menu>
  );

  render() {
    const { minimalUI, selectedStep, stepGroups } = this.props;
    const { selectedPanel } = this.state;
    const showProfile = !!this.lcData.length;

    // TODO: This check should be outside this component
    if (!this.currentWorkflow) {
      // NOTE: Added this styled component to not break the UI, empty state

      // NOTE2: Not passing minimalUI as is because passing boolean prop is
      // not allowed. More details about the warning at
      // https://github.com/styled-components/styled-components/issues/1198
      return (
        <StyledSidebar width={330} minimalui={minimalUI ? 1 : undefined} />
      );
    }

    return (
      <>
        {this.renderActivitySidebar()}
        <StyledSidebar width={330} minimalui={minimalUI ? 1 : undefined}>
          {!minimalUI && this.renderSidebarHeader()}

          <Divider style={{ margin: "10px 0" }} />

          {!minimalUI && this.renderLCData()}

          {showProfile && this.renderProfileStep()}

          {this.loadingSteps ? (
            this.renderLoader()
          ) : (
            <StepsSideBar
              selectedPanelId={selectedPanel}
              selectedStep={selectedStep}
              stepGroups={stepGroups}
              handleStepClick={this.handleStepClick}
              onChangeOfCollapse={this.onChangeOfCollapse}
              stepUserTagData={this.props.stepUserTagData}
            />
          )}
        </StyledSidebar>
      </>
    );
  }
}

function mapStateToProps(state, props) {
  const { workflowDetailsHeader, workflowDetails } = state;
  return {
    workflowDetailsHeader,
    workflowDetails,
    stepGroups: getFilteredStepGroups(
      state,
      props.workflowIdFromDetailsToSidebar
    ) // reselect selector
  };
}

export default connect(mapStateToProps)(injectIntl(Sidebar));
