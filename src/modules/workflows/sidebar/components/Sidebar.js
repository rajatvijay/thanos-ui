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

const { Sider } = Layout;
const Panel = Collapse.Panel;
const confirm = Modal.confirm;

class Sidebar extends Component {
  constructor(props) {
    const { selectedGroup, selectedStep } = props;
    super(props);
    this.state = {
      showSidebar: false,
      isWorkflowPDFModalVisible: false,
      groupId: selectedGroup,
      stepId: selectedStep
      //defaultSelected:true
    };
  }

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  get workflowStatus() {
    const {
      workflowDetailsHeader,
      workflowIdFromDetailsToSidebar
    } = this.props;
    try {
      const workflowStatusFromDetails =
        workflowDetailsHeader[workflowIdFromDetailsToSidebar].status;
      return (
        workflowStatusFromDetails.label ||
        workflowStatusFromDetails.kind_display
      );
    } catch (e) {
      return null;
    }
  }

  callBackCollapser = (object_id, content_type) => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.dispatch(
      workflowDetailsActions.getComment(object_id, content_type)
    );
  };

  openCommentSidebar = () => {
    const { workflowIdFromDetailsToSidebar } = this.props;
    const object_id = this.props.workflowDetailsHeader[
      workflowIdFromDetailsToSidebar
    ].id;
    this.callBackCollapser(object_id, "all_data");
  };

  printDiv = () => {
    const that = this;
    this.setState({ printing: true });

    setTimeout(function() {
      const printContents = document.getElementById("StepBody").innerHTML;
      const docHead = document.querySelector("head").innerHTML;

      const body =
        "<!DOCTYPE html><html><head>" +
        "<title>" +
        //that.props.currentStepFields.currentStepFields.definition.name +
        "</title>" +
        docHead +
        "</head><body>" +
        printContents +
        "</body></html>";
      const myWindow = window.open();
      myWindow.document.write(body);
      myWindow.document.close();
      myWindow.focus();

      setTimeout(function() {
        myWindow.print();
        myWindow.close();
      }, 1000);
      that.setState({ printing: false });
    }, 500);
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

  toggleWorkflowPDFModal = () => {
    this.setState(state => ({
      isWorkflowPDFModalVisible: !state.isWorkflowPDFModalVisible
    }));
  };

  archiveWorkflow = () => {
    const {
      intl,
      dispatch,
      workflowDetailsHeader,
      workflowIdFromDetailsToSidebar
    } = this.props;
    confirm({
      title: intl.formatMessage({
        id: "commonTextInstances.archiveConfirmText"
      }),
      content: intl.formatMessage({
        id: "commonTextInstances.archiveConfirmContent"
      }),
      onOk() {
        const workflowId =
          workflowDetailsHeader[workflowIdFromDetailsToSidebar].id;
        dispatch(workflowDetailsActions.archiveWorkflow(workflowId));
      },
      onCancel() {}
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.selectedGroup !== prevProps.selectedGroup ||
      this.props.selectedStep !== prevProps.selectedStep
    ) {
      this.setState({
        groupId: String(this.props.selectedGroup),
        stepId: String(this.props.selectedStep)
      });
    }
  }

  handleStepClick = (groupid, stepid) => {
    this.setState({
      groupId: String(groupid),
      stepId: String(stepid)
    });
    this.props.onUpdateOfActiveStep(groupid, stepid);
  };

  onChangeOfCollapse = groupid => {
    this.setState({ groupId: String(groupid) });
  };

  onProfileClick = () => {
    if (this.state.stepId) {
      this.setState({ stepId: null });
      this.props.changeProfileDisplay(true);
    }
  };

  renderParent = () => {
    const {
      workflowDetailsHeader,
      workflowIdFromDetailsToSidebar
    } = this.props;

    if (
      workflowDetailsHeader[workflowIdFromDetailsToSidebar].workflow_family &&
      workflowDetailsHeader[workflowIdFromDetailsToSidebar].workflow_family
        .length > 1
    ) {
      const parentWorkflow =
        workflowDetailsHeader[workflowIdFromDetailsToSidebar]
          .workflow_family[0];
      return (
        <Link to={`/workflows/instances/${parentWorkflow.id}`}>
          <span style={{ color: "gray", fontSize: 12 }}>
            {parentWorkflow.name}
          </span>
        </Link>
      );
    }
  };

  workflowActionMenu = (
    <Menu>
      <Chowkidaar check={Permissions.CAN_VIEW_ACTIVITY_LOG}>
        <Menu.Item key={"activity"} onClick={this.toggleSidebar}>
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

  get lcData() {
    const { workflowIdFromDetailsToSidebar } = this.props;
    const lcData = lodashGet(
      this.props,
      `workflowDetailsHeader[${workflowIdFromDetailsToSidebar}].lc_data`,
      []
    );
    // TODO: Check why this logic is required
    const visibelLcData = lcData.filter(
      lc => lc.display_type === "normal" && lc.value
    );
    return visibelLcData;
  }

  render() {
    const {
      workflowDetailsHeader,
      workflowDetails,
      minimalUI,
      workflowIdFromDetailsToSidebar,
      displayProfile
    } = this.props;

    const { groupId, stepId } = this.state;

    return (
      <Sider
        width={330}
        style={{
          overflow: "scroll",
          left: 0,
          backgroundColor: "#FAFAFA",
          padding: "30px",
          paddingTop: 0,
          paddingLeft: minimalUI ? "30px" : "55px",
          zIndex: 0,
          marginRight: minimalUI ? 0 : 35,
          paddingRight: 0,
          position: "relative",
          marginTop: minimalUI ? 0 : 35
        }}
      >
        <div
          style={{
            width: minimalUI ? 280 : "",
            paddingBottom: 100,
            height: "100%",
            backgroundColor: "#FAFAFA"
          }}
        >
          {this.state.showSidebar ? (
            <Drawer
              title="Activity log"
              placement="right"
              closable={true}
              //style={{top:'64px'}}
              onClose={this.toggleSidebar}
              visible={this.state.showSidebar}
              width={500}
              className="activity-log-drawer"
            >
              {process.env.REACT_APP_ACTIVITY_LOG_SERVERLESS ? (
                <ServerlessAuditListTabs
                  id={[
                    ...this.props.workflowDetailsHeader[
                      workflowIdFromDetailsToSidebar
                    ].children.map(item => item.id),
                    workflowIdFromDetailsToSidebar
                  ]}
                />
              ) : (
                <AuditListTabs
                  id={
                    this.props.workflowDetailsHeader[
                      workflowIdFromDetailsToSidebar
                    ].id
                  }
                />
              )}
            </Drawer>
          ) : null}
          {!minimalUI &&
            Object.values(workflowDetailsHeader).length &&
            workflowDetailsHeader[workflowIdFromDetailsToSidebar] && (
              <div>
                <div
                  style={{
                    // color: "#000",
                    padding: "25px 20px",
                    cursor: "pointer",
                    backgroundColor: "#fafafa",
                    justifyContent: "space-between",
                    display: "flex",
                    //fontSize: 24,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    letterSpacing: "-0.05px",
                    lineHeight: "29px",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "calc(100% - 40px)",
                      lineHeight: "normal"
                    }}
                  >
                    {this.renderParent()}
                    <br />
                    <Tooltip
                      title={
                        workflowDetailsHeader[workflowIdFromDetailsToSidebar]
                          .name
                      }
                    >
                      <span
                        style={{
                          maxWidth: "100%",
                          color: "black",
                          fontSize: 24,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          display: "inline-block"
                        }}
                      >
                        {
                          workflowDetailsHeader[workflowIdFromDetailsToSidebar]
                            .name
                        }
                      </span>
                    </Tooltip>
                  </div>
                  <Dropdown
                    overlay={this.workflowActionMenu}
                    className="child-workflow-dropdown"
                  >
                    <span className="pd-ard-sm text-metal text-anchor">
                      <i className="material-icons text-middle t-18 ">
                        more_vert
                      </i>
                    </span>
                  </Dropdown>
                </div>
                <Divider style={{ margin: "10px 0" }} />

                <Chowkidaar check={Permissions.CAN_VIEW_WORKFLOW_PROFILE}>
                  <LCData
                    lcData={[...this.lcData].splice(0, 3)}
                    status={this.workflowStatus}
                    style={{ marginBottom: 15 }}
                  />
                </Chowkidaar>
              </div>
            )}
          <span
            // to={`${history.location.pathname}?group=${
            //   stepgroup.id
            // }&step=${step.id}`}
            style={{
              color: "#000000",
              textDecoration: "none",
              cursor: "pointer"
            }}
            onClick={event => this.onProfileClick()}
            // key={step.id}
          >
            <p
              style={{
                backgroundColor: displayProfile ? "#104774" : "#FAFAFA",
                borderRadius: "50px",
                paddingLeft: "7px",
                paddingTop: "5px",
                paddingBottom: "5px",
                marginLeft: "-9px",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                color: displayProfile ? "white" : "black",
                fontSize: 14
              }}
            >
              <i
                className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                fill="#FFF"
                style={{
                  color: displayProfile ? "white" : "rgb(204, 204, 204)",
                  fontSize: 24
                }}
              >
                {/* {"panorama_fish_eye"} */}
                info_outline
              </i>
              <FormattedMessage id="workflowsInstances.profileText" />
            </p>
          </span>

          {workflowDetails[workflowIdFromDetailsToSidebar] &&
          workflowDetails[workflowIdFromDetailsToSidebar].loading ? (
            <Icon
              type="loading"
              spin
              style={{ position: "absolute", top: "12%", left: "50%" }}
            />
          ) : (
            <div>
              <Collapse
                defaultActiveKey={[groupId]}
                activeKey={groupId}
                accordion
                style={{
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 0,
                  marginBottom: 30
                  //marginTop: minimalUI ? 0 : 41
                }}
                onChange={this.onChangeOfCollapse}
                className="ant-collapse-content"
              >
                {workflowDetails[workflowIdFromDetailsToSidebar] &&
                Object.values(workflowDetails).length &&
                workflowDetails[workflowIdFromDetailsToSidebar].workflowDetails
                  ? workflowDetails[
                      workflowIdFromDetailsToSidebar
                    ].workflowDetails.stepGroups.results
                      .filter(group => group.steps.length)
                      .map((stepgroup, index) => (
                        <Panel
                          key={`${stepgroup.id}`}
                          showArrow={false}
                          header={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: "#fafafa",
                                marginLeft: "-14px"
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontWeight: 500,
                                  fontSize: 14
                                }}
                              >
                                {stepgroup.steps.filter(
                                  step => step.completed_by
                                ).length === stepgroup.steps.length ? (
                                  <i
                                    className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
                                    style={{ color: "#00C89B" }}
                                  >
                                    check_circle
                                  </i>
                                ) : stepgroup.overdue ? (
                                  <Tooltip title="overdue">
                                    <i
                                      className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
                                      style={{ color: "#d40000" }}
                                    >
                                      alarm
                                    </i>
                                  </Tooltip>
                                ) : (
                                  <i
                                    className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
                                    style={{ color: "#CCCCCC" }}
                                  >
                                    panorama_fish_eye
                                  </i>
                                )}
                                {getIntlBody(stepgroup.definition, "name")}
                              </span>
                              <span
                                style={{
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  opacity: 0.2,
                                  color: "#000000",
                                  letterSpacing: "-0.03px",
                                  lineHeight: "18px"
                                }}
                              >
                                {
                                  stepgroup.steps.filter(
                                    step => step.completed_by
                                  ).length
                                }
                                /{stepgroup.steps.length}
                              </span>
                            </div>
                          }
                        >
                          {stepgroup.steps.map((step, index) => (
                            <span
                              key={`${step.id}`}
                              style={
                                groupId === stepgroup.id && stepId === step.id
                                  ? {
                                      backgroundColor: "#104774",
                                      borderRadius: "16px",
                                      paddingLeft: "10px",
                                      paddingTop: "5px",
                                      paddingBottom: "5px",
                                      marginLeft: "-12px",
                                      textDecoration: "none",
                                      cursor: "pointer",
                                      color: "#FFFFFF"
                                    }
                                  : {
                                      backgroundColor: "#fafafa",
                                      textDecoration: "none",
                                      cursor: "pointer"
                                    }
                              }
                              onClick={event =>
                                this.handleStepClick(
                                  stepgroup.id,
                                  step.id,
                                  event
                                )
                              }
                            >
                              <p
                                style={
                                  groupId === stepgroup.id.toString() &&
                                  stepId === step.id.toString() &&
                                  !displayProfile
                                    ? {
                                        backgroundColor: "#104774",
                                        borderRadius: "16px",
                                        paddingLeft: "10px",
                                        paddingTop: "5px",
                                        paddingBottom: "5px",
                                        marginLeft: "-10px",
                                        color: "#FFFFFF"
                                      }
                                    : {
                                        backgroundColor: "#fafafa"
                                        // marginLeft: "-14px"
                                      }
                                }
                              >
                                {step.completed_by ? (
                                  <i
                                    className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                    fill="#FFF"
                                    style={
                                      groupId === stepgroup.id.toString() &&
                                      stepId === step.id.toString()
                                        ? { color: "#00C89B", fontSize: 14 }
                                        : { color: "#00C89B" }
                                    }
                                  >
                                    check_circle
                                  </i>
                                ) : step.overdue ? (
                                  <Tooltip title="overdue">
                                    <i
                                      className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                      style={{ color: "#d40000" }}
                                    >
                                      alarm
                                    </i>
                                  </Tooltip>
                                ) : (
                                  <i
                                    className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                    fill="#FFF"
                                    style={
                                      groupId === stepgroup.id.toString() &&
                                      stepId === step.id.toString()
                                        ? { color: "#FFFFFF", fontSize: 14 }
                                        : { color: "#CCCCCC" }
                                    }
                                  >
                                    {groupId === stepgroup.id.toString() &&
                                    stepId === step.id.toString()
                                      ? "lens"
                                      : "panorama_fish_eye"}
                                  </i>
                                )}
                                {step.name}
                              </p>
                            </span>
                          ))}
                        </Panel>
                      ))
                  : null}
              </Collapse>
            </div>
          )}
        </div>
      </Sider>
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
