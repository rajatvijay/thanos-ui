import React, { Component } from "react";

import {
  Layout,
  Icon,
  Divider,
  Dropdown,
  Collapse,
  Row,
  Menu,
  Col
} from "antd";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

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
    isWorkflowPDFModalVisible: false
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

  render() {
    const { workflowDetailsHeader, workflowDetails } = this.props;
    let lc_data =
      Object.values(workflowDetailsHeader).length &&
      workflowDetailsHeader.workflowDetailsHeader
        ? workflowDetailsHeader.workflowDetailsHeader.lc_data
        : [];
    lc_data = lc_data.filter(
      (data, index) => data.display_type == "normal" && data.value
    );

    let u = new URL(window.location.href);
    let groupId = u.searchParams.get("group");
    let stepId = u.searchParams.get("step");
    const workflowActionMenu = (
      <Menu>
        <Menu.Item key={"activity"} onClick={this.toggleSidebar}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              restore
            </i>{" "}
            <FormattedMessage id="workflowsInstances.viewActivityLog" />
          </span>
        </Menu.Item>

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
        width={450}
        style={{
          position: "fixed",
          overflow: "scroll",
          height: "100vh",
          left: 0,
          backgroundColor: "#FAFAFA",
          padding: "56px",
          paddingTop: 0
        }}
      >
        <div
          style={{
            width: 350,
            paddingBottom: 100,
            height: "100%",
            backgroundColor: "#FAFAFA"
          }}
        >
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
                <i className="material-icons text-middle t-18 ">more_vert</i>
              </span>
            </Dropdown>
          </div>
          <Divider />
          <Row style={{ marginBottom: 25 }}>
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
                    lineHeight: "29px"
                  }}
                >
                  {data.value}
                </span>
              </Col>
            ))}
          </Row>

          <Collapse
            accordion
            style={{
              borderLeft: "none",
              borderRight: "none",
              borderRadius: 0
            }}
            onChange={this.onChangeOfCollapse}
          >
            {Object.values(workflowDetails).length &&
            workflowDetails.workflowDetails
              ? workflowDetails.workflowDetails.stepGroups.results.map(
                  (stepgroup, index) => (
                    <Panel
                      showArrow={false}
                      header={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
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
                            {stepgroup.completed ? (
                              <i
                                className="material-icons t-22 pd-right-sm anticon anticon-check-circle"
                                style={{ color: "#00C89B" }}
                              >
                                check_circle
                              </i>
                            ) : (
                              <i
                                className="material-icons t-22 pd-right-sm anticon anticon-check-circle"
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
                              stepgroup.steps.filter(step => step.completed_by)
                                .length
                            }/{stepgroup.steps.length}
                          </span>
                        </div>
                      }
                      key={index + 1}
                    >
                      {stepgroup.steps.map(step => (
                        <Link
                          to={`${history.location.pathname}?group=${
                            stepgroup.id
                          }&step=${step.id}`}
                          style={
                            groupId === stepgroup.id && stepId === step.id
                              ? {
                                  color: "#969696",
                                  textDecoration: "none",
                                  backgroundColor: "#104774",
                                  borderRadius: "16px"
                                }
                              : { color: "#969696", textDecoration: "none" }
                          }
                        >
                          <p>
                            {step.completed_by ? (
                              <i
                                className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                style={{ color: "#00C89B" }}
                              >
                                check_circle
                              </i>
                            ) : (
                              <i
                                className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
                                style={{ color: "#CCCCCC" }}
                              >
                                panorama_fish_eye
                              </i>
                            )}
                            {step.name}
                          </p>
                        </Link>
                      ))}
                    </Panel>
                  )
                )
              : null}
          </Collapse>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const { workflowDetailsHeader, workflowDetails } = state;
  return {
    workflowDetailsHeader,
    workflowDetails
  };
}

export default connect(mapStateToProps)(Sidebar);
