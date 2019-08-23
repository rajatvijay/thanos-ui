import React, { Component } from "react";
import {
  Collapse,
  Divider,
  Drawer,
  Dropdown,
  Icon,
  Layout,
  Menu,
  Modal,
  Tooltip
} from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import ServerlessAuditListTabs from "../../../../js/components/Navbar/ServerlessAuditListTabs";
import AuditListTabs from "../../../../js/components/Navbar/audit_log";
import {
  workflowDetailsActions,
  workflowStepActions
} from "../../../../js/actions";
import { Chowkidaar } from "../../../common/permissions/Chowkidaar";
import Permissions from "../../../common/permissions/constants";
import { Link } from "react-router-dom";

import LCData from "./LCData";
import { getIntlBody } from "../../../../js/_helpers/intl-helpers";
import { get as lodashGet } from "lodash";
import styled from "@emotion/styled";
import { css } from "emotion";

const { Sider } = Layout;
const Panel = Collapse.Panel;
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

  // ==================================================================================================== //
  // ==================================================================================================== //
  // ==================================================================================================== //
  // ==================================================================================================== //

  // DIRTY CODE, SORRY!!

  callBackCollapser = (object_id, content_type) => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.dispatch(
      workflowDetailsActions.getComment(object_id, content_type)
    );
  };

  addComment = (payload, step_reload_payload) => {
    this.state.adding_comment = true;
    this.state.object_id = payload.object_id;
    this.props.dispatch(
      workflowStepActions.addComment(payload, step_reload_payload)
    );
  };

  getComment = object_id => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.addComment(object_id, "workflow");
  };

  openCommentSidebar = () => {
    const { workflowIdFromDetailsToSidebar } = this.props;
    const object_id = this.props.workflowDetailsHeader[
      workflowIdFromDetailsToSidebar
    ].id;
    this.callBackCollapser(object_id, "all_data");
  };

  // ////////////////// ////////////////// ////////////////
  // ////////////////// ////////////////// ////////////////
  // ////////////////// ////////////////// ////////////////
  // ////////////////// ////////////////// ////////////////

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

  get parentWorkflow() {
    const family = lodashGet(this.currentWorkflow, `workflow_family`, null);
    return family.length > 1 ? family[0] : null;
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
    return lodashGet(this.currentWorkflow, "loading", null);
  }

  get stepGroups() {
    const { workflowDetails, workflowIdFromDetailsToSidebar } = this.props;
    const stepGroups = lodashGet(
      workflowDetails,
      `[${workflowIdFromDetailsToSidebar}].workflowDetails.stepGroups.results`,
      []
    );
    return stepGroups.filter(group => group.steps.length);
  }

  // ALL RENDER FUNCTIONS
  renderParent = () => {
    if (this.parentWorkflow) {
      return (
        <Link to={`/workflows/instances/${this.parentWorkflow.id}`}>
          <span style={{ color: "gray", fontSize: 12 }}>
            {this.parentWorkflow.name}
          </span>
        </Link>
      );
    }
    return null;
  };

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
        {process.env.REACT_APP_ACTIVITY_LOG_SERVERLESS ? (
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
          {this.renderParent()}
          <br />
          <StyledWorkflowName>{this.currentWorkflowName}</StyledWorkflowName>
        </div>
        <Dropdown
          overlay={this.workflowActionMenu}
          className="child-workflow-dropdown"
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
      <StyledCollapseItem
        onClick={this.onProfileClick}
        selected={profileSelected}
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
    );
  };

  renderLoader = () => {
    return (
      <Icon
        type="loading"
        spin
        style={{ position: "absolute", top: "12%", left: "50%" }}
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

      <Chowkidaar check={Permissions.CAN_ARCHIVE_WORKFLOW}>
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
    const { minimalUI, selectedStep } = this.props;
    const { selectedPanel } = this.state;

    // TODO: This check should be outside this component
    if (!this.currentWorkflow) {
      return null;
    }

    return (
      <>
        {this.renderActivitySidebar()}
        <StyledSidebar width={330} minimalUI={minimalUI}>
          {!minimalUI && this.renderSidebarHeader()}

          <Divider style={{ margin: "10px 0" }} />

          {!minimalUI && this.renderLCData()}

          {this.renderProfileStep()}

          {this.loadingSteps ? (
            this.renderLoader()
          ) : (
            <StepsSideBar
              selectedPanelId={selectedPanel}
              selectedStep={selectedStep}
              stepGroups={this.stepGroups}
              handleStepClick={this.handleStepClick}
              onChangeOfCollapse={this.onChangeOfCollapse}
            />
          )}
        </StyledSidebar>
      </>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowDetailsHeader,
    workflowDetails,
    currentStepFields,
    config
  } = state;
  return { workflowDetailsHeader, workflowDetails, currentStepFields, config };
}

export default connect(mapStateToProps)(injectIntl(Sidebar));

class StepsSideBar extends Component {
  renderStepGroupIcon(stepGroup) {
    const allStepsCompleted = !stepGroup.steps.find(step => !step.completed_by);
    const isOverdue = stepGroup.overdue;

    if (allStepsCompleted) {
      return (
        <i
          className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
          style={{ color: "#00C89B" }}
        >
          check_circle
        </i>
      );
    }

    if (isOverdue) {
      return (
        <Tooltip title="Overdue">
          <i
            className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
            style={{ color: "#d40000" }}
          >
            alarm
          </i>
        </Tooltip>
      );
    }

    return (
      <i
        className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
        style={{ color: "#CCCCCC" }}
      >
        panorama_fish_eye
      </i>
    );
  }
  renderStepsCountStatus(stepGroup) {
    return (
      <span
        className={css`
          font-weight: 500;
          font-size: 14px;
          opacity: 0.2;
          color: #000000;
          letter-spacing: -0.03px;
          line-height: 18px;
        `}
      >
        {stepGroup.steps.filter(step => step.completed_by).length}/
        {stepGroup.steps.length}
      </span>
    );
  }
  renderStepGroup(stepGroup) {
    return (
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fafafa;
          margin-left: -14px;
        `}
      >
        <span
          className={css`
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 14;
          `}
        >
          {this.renderStepGroupIcon(stepGroup)}

          {/* TODO: Kya hai, kyun hai yeh? */}
          {getIntlBody(stepGroup.definition, "name")}
        </span>
        {this.renderStepsCountStatus(stepGroup)}
      </div>
    );
  }

  isStepSelected = step => {
    const { selectedStep } = this.props;
    // eslint-disable-next-line
    return selectedStep == step.id;
  };

  isStepOverdue = step => !!step.overdue;

  renderStepIcon = step => {
    const isCompleted = !!step.completed_by;
    const isSelected = this.isStepSelected(step);
    const isOverdue = this.isStepOverdue(step);

    if (isCompleted) {
      return (
        <i
          className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
          fill="#FFF"
          style={
            isSelected
              ? { color: "#00C89B", fontSize: 14 }
              : { color: "#00C89B" }
          }
        >
          check_circle
        </i>
      );
    }

    if (isOverdue) {
      return (
        <Tooltip title="overdue">
          {/* TODO: Refactor all the icons */}
          <i
            className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
            style={{ color: "#d40000" }}
          >
            alarm
          </i>
        </Tooltip>
      );
    }

    return (
      <i
        className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
        fill="#FFF"
        style={
          isSelected ? { color: "#FFFFFF", fontSize: 14 } : { color: "#CCCCCC" }
        }
      >
        {isSelected ? "lens" : "panorama_fish_eye"}
      </i>
    );
  };

  renderSteps(step, stepGroup) {
    const isSelected = this.isStepSelected(step);
    return (
      <StyledCollapseItem
        onClick={event =>
          this.props.handleStepClick(stepGroup.id, step.id, event)
        }
        selected={isSelected}
      >
        {this.renderStepIcon(step)}
        {step.name}
      </StyledCollapseItem>
    );
  }

  render() {
    const { stepGroups, selectedPanelId } = this.props;
    return (
      // <div>
      <StyledCollapse
        // TODO: Doesn't update group from query params
        activeKey={selectedPanelId}
        accordion
        onChange={this.props.onChangeOfCollapse}
        // className="ant-collapse-content"
      >
        {stepGroups.map(stepGroup => (
          <Panel
            key={stepGroup.id}
            showArrow={false}
            header={this.renderStepGroup(stepGroup)}
          >
            {stepGroup.steps.map(step => this.renderSteps(step, stepGroup))}
          </Panel>
        ))}
      </StyledCollapse>
      // </div>
    );
  }
}

const StyledSidebar = styled(Sider)`
  overflow: scroll;
  left: 0;
  background-color: #fafafa;
  padding: 30px;
  padding-top: 0;
  padding-left: ${({ minimalUI }) => (minimalUI ? "30px" : "55px")};
  z-index: 0;
  margin-right: ${({ minimalUI }) => (minimalUI ? 0 : 35)};
  padding-right: 0;
  position: relative;
  margin-top: ${({ minimalUI }) => (minimalUI ? 0 : 35)};
`;

const StyledSidebarHeader = styled.div`
  padding: 25px 20px;
  cursor: pointer;
  background-color: #fafafa;
  justify-content: space-between;
  display: flex;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  letter-spacing: -0.05px;
  line-height: 29px;
  align-items: center;
`;

const StyledWorkflowName = styled.span`
  max-width: 100%;
  color: black;
  font-size: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
`;

const StyledCollapse = styled(Collapse)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  margin-bottom: 30;
`;

const StyledCollapseItem = styled.span`
  text-decoration: none;
  cursor: pointer;
  border-radius: 50px;
  padding-left: 7px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: -9px;
  margin-bottom: 8;
  display: flex;
  align-items: center;
  font-size: 14;
  background-color: ${props => (props.selected ? "#104774" : "#FAFAFA")};
  color: ${props => (props.selected ? "white" : "black")};
`;
