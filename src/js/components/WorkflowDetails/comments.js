import React, { Component } from "react";
import {
  Layout,
  Icon,
  Select,
  Avatar,
  Collapse,
  Button,
  Breadcrumb,
  Tag,
  Mention,
  Divider,
  Row,
  Col,
  Menu,
  Dropdown,
  Cascader,
  Upload,
  Modal,
  Tooltip
} from "antd";
import { Link } from "react-router-dom";
import { workflowDetailsActions, changeStatusActions } from "../../actions";
import { integrationCommonFunctions } from "./field-types/integration_common";
import _ from "lodash";
import Moment from "react-moment";
import { FormattedMessage, injectIntl } from "react-intl";
import MentionWithAttachments from "./MentionWithAttachments";
import { workflowFiltersService } from "../../services";

const { toString, toContentState } = Mention;

const { Sider, Content } = Layout;
const Option = Select.Option;

class Comments extends Component {
  constructor(props) {
    super();
    this.state = {
      message: toContentState(""),
      fileList: [],
      uploading: false,
      workflowStatuses: []
    };
    // call action
  }

  getWorkflowKind = ({ workflowComments }) => {
    try {
      return workflowComments.data.results[0].target.definition.kind;
    } catch (e) {
      return null;
    }
  };

  componentDidMount() {
    const workflowKind = this.getWorkflowKind(this.props);

    if (workflowKind) {
      workflowFiltersService
        .getStatusData({ workflow_kind: workflowKind })
        .then(response => {
          this.setState({ workflowStatuses: response });
        });
    }
  }

  componentDidUpdate(previousProps) {
    const currentWorkflowKind = this.getWorkflowKind(this.props);
    const previousWorkflowKind = this.getWorkflowKind(previousProps);

    if (currentWorkflowKind && currentWorkflowKind !== previousWorkflowKind) {
      workflowFiltersService
        .getStatusData({ workflow_kind: currentWorkflowKind })
        .then(response => {
          this.setState({ workflowStatuses: response });
        });
    }
  }

  callback = key => {};

  toggle = () => {
    this.props.toggleSidebar();
  };

  onChange = value => {
    this.state.comment = toString(value);
    this.setState({ message: value });
  };

  addComment = (c, message, files) => {
    let content_type = "step";
    if (c.content_type == "integrationresult") {
      content_type = "integrationresult";
    } else if (c.target.field_details) {
      content_type = "field";
    } else if (c.target.workflow_details) {
      content_type = "workflow";
    }

    const { fileList: filesFromState } = this.state;
    const fileList = files && files.length ? files : filesFromState;
    // const formData = new FormData();
    // fileList.forEach(file => {
    //   formData.append("files[]", file);
    // });

    let step_reload_payload = {
      workflowId: this.props.currentStepFields.currentStepFields.workflow,
      groupId: this.props.currentStepFields.currentStepFields.step_group,
      stepId: this.props.currentStepFields.currentStepFields.id
    };

    this.props.addComment(
      {
        object_id: c.object_id,
        type: content_type,
        message: message || this.state.comment,
        attachment: _.size(fileList) ? fileList[0] : ""
      },
      step_reload_payload
    );
    this.setState({ message: toContentState(""), fileList: [] });
  };

  selectStep = target => {
    let payload = {
      workflowId: target.workflow,
      groupId: target.step_group_details.id,
      stepId: target.step_details.id
    };
    this.props.gotoStep(payload); // select the step
    this.props.toggleSidebar(); // closing the sidebar
    this.props.selectActiveStep(
      target.step_details.id,
      target.step_group_details.id
    ); // making the step active (this is not working for now)
    // open comment sidebar for selected field or steip
    if (target.field_details.id) {
      this.props.toggleSidebar(target.field_details.id, "field");
    } else {
      this.props.toggleSidebar(target.step_details.id, "step");
    }
  };

  selectFlag = option => {
    let flag = option[0];
    let reason = _.size(option) > 1 ? option[1] : "";
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let target = _.size(comments.results) ? comments.results[0].target : {};

    let payload = {};
    if (target.field_details) {
      payload = {
        workflow: target.workflow,
        field: target.field_details.id,
        flag: parseInt(flag),
        reason_code: reason
      };
    } else if (target.workflow_details) {
      payload = {
        workflow: target.workflow_details.id,
        flag: parseInt(flag),
        reason_code: reason
      };
    }

    if (target.field_details && target.field_details.is_integration_type) {
      payload["integration_uid"] = target.uid;
    }
    this.props.changeFlag(payload);
  };

  changeStatus = value => {
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let target = _.size(comments.results) ? comments.results[0].target : {};

    if (!target.field_details.is_integration_type) {
      return;
    }
    let payload = {
      parent_field_id: target.row_json.parent_field_id,
      parent_row_uid: target.row_json.parent_row_uid,
      krypton_status: value,
      field_id: target.field,
      row_uid: target.uid,
      changed_key: "krypton_status",
      display_item: "Status"
    };

    this.props.changeIntegrationStatus(payload);
  };

  changeRiskCode = value => {
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let target = _.size(comments.results) ? comments.results[0].target : {};

    if (!target.field_details.is_integration_type) {
      return;
    }
    let payload = {
      //parent_field_id: target.row_json.parent_field_id,
      //parent_row_uid: target.row_json.parent_row_uid,
      krypton_risk_code: value,
      field_id: target.field,
      row_uid: target.uid,
      changed_key: "krypton_risk_code",
      display_item: "Risk Code"
    };

    console.log(payload, target);
    this.props.changeIntegrationStatus(payload);
  };

  changeWorkflowStatus = value => {
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let target = _.size(comments.results) ? comments.results[0].target : {};

    if (!target.workflow_details) {
      return;
    }

    let payload = {
      workflowId: target.workflow_details.id,
      statusId: value,
      addComment: true
    };

    let step_reload_payload = {
      workflowId: this.props.currentStepFields.currentStepFields.workflow,
      groupId: this.props.currentStepFields.currentStepFields.step_group,
      stepId: this.props.currentStepFields.currentStepFields.id
    };

    this.props.dispatch(changeStatusActions(payload, step_reload_payload));
  };

  addAttachementInState = file => {
    this.setState(state => ({ fileList: [...state.fileList, file] }));
  };

  render() {
    const Panel = Collapse.Panel;
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let that = this;
    let single_comments = _.size(comments.results) <= 1 ? true : false;
    let c = _.size(comments.results) ? comments.results[0] : [];

    let adjudication = (
      <div>
        <span className="text-metal text-medium t-12 pd-right-sm">
          Adjudication:{" "}
        </span>
        <Cascader
          style={{ width: "calc(100% - 85px)" }}
          options={c.target.comment_flag_options}
          onChange={that.selectFlag}
          placeholder="Change flag"
        />
      </div>
    );

    let workflow_status_dropdown = (
      <div>
        <span className="text-metal text-medium t-12 pd-right-sm">
          Status:{" "}
        </span>
        <Select
          placeholder="Select a status"
          style={{ width: "calc(100% - 80px)" }}
          onChange={that.changeWorkflowStatus}
        >
          {_.map(that.state.workflowStatuses, function(v) {
            return <Option value={v.id}>{v.label}</Option>;
          })}
        </Select>
      </div>
    );

    // for comment attachments
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        this.addAttachementInState(file);
        return false;
      },
      fileList
    };

    return (
      <Sider
        className="comments-sidebar profile-sidebar sidebar-right animated slideInRight"
        style={{
          background: "#fff",
          // overflow: "auto",
          height: "calc(100vh - 70px)",
          position: "fixed",
          right: 0,
          top: "65px",
          zIndex: 1
        }}
        width="570"
        collapsed={false}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        trigger={null}
      >
        <div className="comment-details" style={{ width: "570px" }}>
          <div className="sidebar-head">
            <span className="sidebar-title">
              <FormattedMessage id="stepBodyFormInstances.addComments" />
            </span>
            <Icon
              type="close"
              onClick={this.toggle}
              style={{ float: "right", marginTop: "4px" }}
            />
          </div>
          <Content style={{ padding: "15px", paddingBottom: "50px" }}>
            {_.map(comments.results, function(c) {
              if (!single_comments && !_.size(c.messages)) {
                return null;
              }
              return (
                <div
                  style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
                >
                  {c.target.step_group_details ? (
                    <span style={{ width: "100%" }}>
                      <span className="text-bold">
                        {c.target.step_group_details.name}{" "}
                      </span>:{" "}
                      <span
                        className="text-bold text-grey"
                        onClick={that.selectStep.bind(this, c.target)}
                      >
                        {c.target.step_details.name}
                      </span>
                    </span>
                  ) : null}

                  <span style={{ fontWeight: "bold" }}>
                    {integrationCommonFunctions.comment_answer_body(c)}
                  </span>

                  {c.target.field_details &&
                  c.target.field_details.is_integration_type ? (
                    <div style={{ marginTop: "10px" }}>
                      <div>
                        <span style={{ color: "#575757", fontSize: "12px" }}>
                          Status:
                        </span>
                      </div>
                      <Select
                        placeholder="Select a status"
                        style={{ width: "100%" }}
                        onChange={that.changeStatus}
                      >
                        <Option value="open">Open</Option>
                        <Option value="closed">Closed</Option>
                      </Select>
                    </div>
                  ) : null}

                  {c.target.field_details &&
                  (c.target.field_details.type == "google_search" ||
                    c.target.field_details.type == "serp_google_search") ? (
                    <div style={{ marginTop: "10px" }}>
                      <div>
                        <span style={{ color: "#575757", fontSize: "12px" }}>
                          Risk Codes:
                        </span>
                      </div>
                      <Select
                        placeholder="Select a risk code"
                        style={{ width: "100%" }}
                        onChange={that.changeRiskCode}
                      >
                        <Option value="Association & PEP Risk">
                          Association & PEP Risk
                        </Option>
                        <Option value="Criminal Risk">Criminal Risk</Option>
                        <Option value="Financial Condition Risk">
                          Financial Condition Risk
                        </Option>
                        <Option value="Legal Risk">Legal Risk</Option>
                        <Option value="Prohibited Entities Risk">
                          Prohibited Entities Risk
                        </Option>
                        <Option value="Regulatory Risk">Regulatory Risk</Option>
                        <Option value="Reputation Risk">Reputation Risk</Option>
                      </Select>
                    </div>
                  ) : null}

                  <Divider className="thin" />

                  {/*single_comments || c.messages.length  ? (
                    <div>
                      <span
                        style={{
                          position: "relative",
                          top: "-39px",
                          fontSize: "12px",
                          backgroundColor: "#fff",
                          paddingRight: "10px",
                          color: "#575757"
                        }}
                      >
                        <FormattedMessage id="stepBodyFormInstances.commentsQuetions" />
                      </span>
                    </div>
                  ) : null*/}

                  <div
                    className="comments-list"
                    style={{ maxHeight: "calc(100vh - 430px)" }}
                  >
                    {_.map(c.messages, function(msg) {
                      let attachment_text = null;
                      if (msg.attachment) {
                        attachment_text = msg.attachment.split("/")[
                          msg.attachment.split("/").length - 1
                        ];
                        attachment_text = attachment_text.split("?")[0];
                      }
                      return (
                        <div key={msg.id} className="mr-bottom">
                          <Avatar
                            size="small"
                            icon="user"
                            style={{ float: "left" }}
                          />
                          <div
                            style={{
                              marginLeft: "30px",
                              fontSize: "12px",
                              padding: "2px 0px 3px"
                            }}
                          >
                            <b style={{ color: "#162c5b" }}>
                              {msg.posted_by.first_name !== ""
                                ? msg.posted_by.first_name
                                : msg.posted_by.email}
                            </b>
                            <span
                              style={{
                                fontSize: "11px",
                                marginLeft: "6px",
                                cursor: "pointer"
                              }}
                            >
                              <Tooltip
                                title={
                                  <Moment format="DD/MM/YYYY, h:mm a">
                                    {msg.created_at}
                                  </Moment>
                                }
                              >
                                <Moment fromNow>{msg.created_at}</Moment>
                              </Tooltip>
                            </span>
                          </div>
                          <p style={{ fontSize: "12px", paddingLeft: "32px" }}>
                            <div
                              className="Container"
                              dangerouslySetInnerHTML={{
                                __html: msg.message.replace(
                                  /@([a-z\d_]+)/gi,
                                  '<a class="mentions" href="/users/">@$1</a>'
                                )
                              }}
                            />
                          </p>
                          {msg.attachment ? (
                            <span
                              style={{
                                fontSize: "12px",
                                paddingLeft: "32px",
                                position: "relative",
                                top: "-17px"
                              }}
                            >
                              <i class="anticon anticon-paper-clip" />&nbsp;
                              <a href={msg.attachment}>{attachment_text}</a>
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {single_comments ? (
                    <div className="affix-bottom">
                      <div className="comment-actions">
                        <Row>
                          {c.target.workflow_details ? (
                            <Col span={10}>
                              {c.target.workflow_details
                                ? workflow_status_dropdown
                                : null}
                            </Col>
                          ) : null}
                          <Col span={c.target.workflow_details ? 14 : 24}>
                            {(c.target.field_details ||
                              c.target.workflow_details) &&
                            comments.results
                              ? adjudication
                              : null}
                          </Col>
                        </Row>

                        <div className="mr-top mr-bottom">
                          <span className="text-metal text-medium t-12 pd-right-sm">
                            Comment:{" "}
                          </span>
                          <MentionWithAttachments
                            comment={c}
                            addComment={that.addComment}
                            placeholder={that.props.intl.formatMessage({
                              id: "stepBodyFormInstances.enterComment"
                            })}
                            onChange={that.onChange}
                            message={that.state.message}
                            addAttachement={that.addAttachementInState}
                          />
                          {/* <Mention
                            ref={el => that.addRefAndData(el, c)}
                            style={{ width: "470px", height: 30 }}
                            suggestions={c.mentions}
                            placeholder={that.props.intl.formatMessage({
                              id: "stepBodyFormInstances.enterComment"
                            })}
                            multiLines
                            onChange={that.onChange}
                            value={that.state.message}
                            notFoundContent={"user not found"}
                          /> */}
                        </div>

                        <div>
                          <Upload
                            {...props}
                            style={{ position: "relative", left: "68px" }}
                          >
                            <Button>
                              <Icon type="upload" /> Add attachment
                            </Button>
                          </Upload>
                        </div>

                        <div className="text-right">
                          <Button
                            onClick={() => that.addComment.bind(this)(c)}
                            style={{ position: "relative", top: "-31px" }}
                          >
                            <FormattedMessage id="stepBodyFormInstances.postButtonText" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Content>
        </div>
      </Sider>
    );
  }
}

export default injectIntl(Comments);
