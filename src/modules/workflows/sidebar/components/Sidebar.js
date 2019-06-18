import React, { Component } from "react";
import {
  Layout,
  Divider,
  Dropdown,
  Collapse,
  Row,
  Menu,
  Col,
  Drawer,
  spin,
  Icon
} from "antd";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AuditListTabs from "../../../../js/components/Navbar/audit_log";
import {
  workflowDetailsActions,
  workflowStepActions
} from "../../../../js/actions";
import { history } from "../../../../js/_helpers";
const { Sider } = Layout;

const Panel = Collapse.Panel;

class Sidebar extends Component {
  state = {
    current:
      Object.values(this.props.workflowDetailsHeader).length &&
      this.props.workflowDetailsHeader.workflowDetailsHeader
        ? this.props.workflowDetailsHeader.workflowDetailsHeader.status.label
        : null,
    showSidebar: false,
    isWorkflowPDFModalVisible: false,
    groupId: null,
    stepId: null
  };

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  callBackCollapser = (object_id, content_type) => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.dispatch(
      workflowDetailsActions.getComment(object_id, content_type)
    );
  };

  openCommentSidebar = () => {
    let object_id = this.props.workflowDetailsHeader.workflowDetailsHeader.id;
    this.callBackCollapser(object_id, "all_data");
  };

  printDiv = () => {
    var that = this;
    this.setState({ printing: true });

    setTimeout(function() {
      var printContents = document.getElementById("StepBody").innerHTML;
      var docHead = document.querySelector("head").innerHTML;

      var body =
        "<!DOCTYPE html><html><head>" +
        "<title>" +
        //that.props.currentStepFields.currentStepFields.definition.name +
        "</title>" +
        docHead +
        "</head><body>" +
        printContents +
        "</body></html>";
      var myWindow = window.open();
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

  updateActiveStep = () => {
    this.setState({
      groupId: new URL(window.location.href).searchParams.get("group"),
      stepId: new URL(window.location.href).searchParams.get("step")
    });
  };

  componentDidMount() {
    this.setState({
      groupId: new URL(window.location.href).searchParams.get("group"),
      stepId: new URL(window.location.href).searchParams.get("step")
    });
    this.setState({
      groupId: String(this.props.selectedGroup),
      stepId: String(this.props.selectedStep)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.currentStepFields.currentStepFields !==
      prevProps.currentStepFields.currentStepFields
    ) {
      if (
        this.props.currentStepFields.currentStepFields.id !==
        prevProps.currentStepFields.currentStepFields.id
      ) {
        this.setState({
          groupId: new URL(window.location.href).searchParams.get("group"),
          stepId: new URL(window.location.href).searchParams.get("step")
        });
      }
    }

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

  onClickOfLink = (groupid, stepid) => {
    this.setState({
      groupId: String(groupid),
      stepId: String(stepid)
    });
  };

  onChangeOfCollapse = groupid => {
    this.setState({ groupId: String(groupid) });
  };

  render() {
    const {
      workflowDetailsHeader,
      workflowDetails,
      minimalUI,
      act
    } = this.props;
    console.log("min", minimalUI);
    let lc_data =
      Object.values(workflowDetailsHeader).length &&
      workflowDetailsHeader.workflowDetailsHeader
        ? workflowDetailsHeader.workflowDetailsHeader.lc_data
        : [];
    lc_data = lc_data.filter(
      (data, index) => data.display_type == "normal" && data.value
    );

    const { groupId, stepId } = this.state;

    const workflowActionMenu = (
      <Menu>
        {this.props.config.permissions.includes("Can View Activity Log") ? (
          <Menu.Item key={"activity"} onClick={this.toggleSidebar}>
            <span>
              <i className="material-icons t-18 text-middle pd-right-sm">
                restore
              </i>{" "}
              <FormattedMessage id="workflowsInstances.viewActivityLog" />
            </span>
          </Menu.Item>
        ) : null}

        <Menu.Item key={"message"} onClick={this.openCommentSidebar}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              chat_bubble
            </i>{" "}
            <FormattedMessage id="stepBodyFormInstances.addComments" />
          </span>
        </Menu.Item>

        <Menu.Item key={"pint"} onClick={this.printDiv}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">print</i>{" "}
            <FormattedMessage id="stepBodyFormInstances.printText" />
          </span>
        </Menu.Item>

        <Menu.Item key={"printWorkflow"} onClick={this.toggleWorkflowPDFModal}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              file_copy
            </i>{" "}
            <FormattedMessage id="stepBodyFormInstances.downloadWorkflowPDF" />
          </span>
        </Menu.Item>
      </Menu>
    );

    return (
      <Sider
        width={330}
        style={{
          overflow: "scroll",
          left: 0,
          backgroundColor: "#FAFAFA",
          padding: "30px",
          paddingTop: 0,
          paddingLeft: minimalUI ? "30px" : "50px",
          zIndex: 0,
          marginRight: minimalUI ? 0 : 20,
          paddingRight: 0,
          position: "relative"
        }}
      >
        <div
          style={{
            width: 280,
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
              <AuditListTabs
                id={this.props.workflowDetailsHeader.workflowDetailsHeader.id}
              />
            </Drawer>
          ) : null}
          {!minimalUI && (
            <div>
              <div
                style={{
                  color: "#000",
                  padding: "25px 20px",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                  justifyContent: "space-between",
                  display: "flex",
                  fontSize: 24,
                  paddingBottom: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  letterSpacing: "-0.05px",
                  lineHeight: "29px",
                  alignItems: "center"
                }}
              >
                {Object.values(workflowDetailsHeader).length &&
                workflowDetailsHeader.workflowDetailsHeader
                  ? workflowDetailsHeader.workflowDetailsHeader.name
                  : ""}
                <Dropdown
                  overlay={workflowActionMenu}
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
              <Row style={{ marginBottom: 15 }}>
                {lc_data.map(data => (
                  <Col span={12}>
                    <span
                      style={{
                        opacity: 0.3,
                        color: "#000000",
                        fontSize: "12px",
                        fontWeight: "bold",
                        letterSpacing: "-0.02px",
                        lineHeight: "15px"
                      }}
                    >
                      {data.label}
                    </span>
                    <br />
                    <span
                      style={{
                        color: "#000000",
                        fontSize: "12px",
                        letterSpacing: "-0.02px",
                        lineHeight: "29px",
                        wordWrap: "break-word"
                      }}
                    >
                      {data.value}
                    </span>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {workflowDetails.loading && minimalUI ? (
            <Icon
              type="loading"
              spin
              style={{ position: "absolute", top: "12%", left: "50%" }}
            />
          ) : (
            <Collapse
              defaultActiveKey={groupId}
              activeKey={groupId}
              accordion
              style={{
                borderLeft: "none",
                borderRight: "none",
                borderRadius: 0,
                marginBottom: 30,
                marginTop: minimalUI ? 0 : 41
              }}
              onChange={this.onChangeOfCollapse}
              className="ant-collapse-content"
            >
              {Object.values(workflowDetails).length &&
              workflowDetails.workflowDetails
                ? workflowDetails.workflowDetails.stepGroups.results
                    .filter(group => group.steps.length)
                    .map((stepgroup, index) => (
                      <Panel
                        key={stepgroup.id}
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
                              {stepgroup.steps.filter(step => step.completed_by)
                                .length === stepgroup.steps.length ? (
                                <i
                                  className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
                                  style={{ color: "#00C89B" }}
                                >
                                  check_circle
                                </i>
                              ) : (
                                <i
                                  className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
                                  style={{ color: "#CCCCCC" }}
                                >
                                  panorama_fish_eye
                                </i>
                              )}
                              {stepgroup.definition.name}
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
                        {stepgroup.steps.map(step => (
                          <Link
                            to={`${history.location.pathname}?group=${
                              stepgroup.id
                            }&step=${step.id}`}
                            style={
                              groupId == stepgroup.id && stepId == step.id
                                ? {
                                    color: "#fff",
                                    textDecoration: "none"
                                  }
                                : {
                                    color: "#969696",
                                    textDecoration: "none"
                                  }
                            }
                            onClick={event =>
                              this.onClickOfLink(stepgroup.id, step.id, event)
                            }
                            key={step.id}
                          >
                            <p
                              style={
                                groupId == stepgroup.id && stepId == step.id
                                  ? {
                                      backgroundColor: "#104774",
                                      borderRadius: "16px",
                                      paddingLeft: "10px",
                                      paddingTop: "5px",
                                      paddingBottom: "5px",
                                      marginLeft: "-12px",
                                      marginLeft: "-14px"
                                    }
                                  : {
                                      backgroundColor: "#fafafa",
                                      marginLeft: "-14px"
                                    }
                              }
                            >
                              {step.completed_by ? (
                                <i
                                  className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                  fill="#FFF"
                                  style={
                                    groupId == stepgroup.id && stepId == step.id
                                      ? { color: "#00C89B", fontSize: 18 }
                                      : { color: "#00C89B" }
                                  }
                                >
                                  check_circle
                                </i>
                              ) : (
                                <i
                                  className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                  fill="#FFF"
                                  style={
                                    groupId == stepgroup.id && stepId == step.id
                                      ? { color: "#FFFFFF", fontSize: 16 }
                                      : { color: "#CCCCCC" }
                                  }
                                >
                                  {groupId == stepgroup.id && stepId == step.id
                                    ? "lens"
                                    : "panorama_fish_eye"}
                                </i>
                              )}
                              {step.name}
                            </p>
                          </Link>
                        ))}
                      </Panel>
                    ))
                : null}
            </Collapse>
          )}
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    workflowDetailsHeader,
    workflowDetails,
    currentStepFields,
    config
  } = state;
  return { workflowDetailsHeader, workflowDetails, currentStepFields };
}

export default connect(mapStateToProps)(Sidebar);
