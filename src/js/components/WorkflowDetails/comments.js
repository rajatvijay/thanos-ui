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
import styled from "@emotion/styled";
import { css } from "emotion";

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

  componentDidMount = () => {
    const workflowKind = this.getWorkflowKind(this.props);

    if (workflowKind) {
      workflowFiltersService
        .getStatusData({ workflow_kind: workflowKind })
        .then(response => {
          this.setState({ workflowStatuses: response });
        });
    }
  };

  componentDidUpdate = previousProps => {
    const currentWorkflowKind = this.getWorkflowKind(this.props);
    const previousWorkflowKind = this.getWorkflowKind(previousProps);

    if (currentWorkflowKind && currentWorkflowKind !== previousWorkflowKind) {
      workflowFiltersService
        .getStatusData({ workflow_kind: currentWorkflowKind })
        .then(response => {
          this.setState({ workflowStatuses: response });
        });
    }
  };

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
      step_reload_payload,
      this.props.isEmbedded
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

    this.props.dispatch(
      changeStatusActions(payload, step_reload_payload, this.props.isEmbedded)
    );
  };

  addAttachementInState = file => {
    this.setState(state => ({ fileList: [...state.fileList, file] }));
  };

  sortedCommentFlag = comment_flag_options => {
    function sortWithLabel(arr) {
      return arr.sort((a, b) =>
        a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
      );
    }

    const sortedRisk = sortWithLabel(comment_flag_options).map(item => ({
      ...item,
      children: sortWithLabel(item.children)
    }));

    return sortedRisk;
  };

  render() {
    const Panel = Collapse.Panel;
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let that = this;
    let single_comments = _.size(comments.results) <= 1 ? true : false;
    let c = _.size(comments.results) ? comments.results[0] : [];

    //ADJUDICATION SELECTION
    const adjudication = (
      <div>
        <div className="  t-16 text-light">Adjudication:</div>
        <Cascader
          style={{ width: "100%", marginTop: "6px" }}
          options={this.sortedCommentFlag(c.target.comment_flag_options)}
          onChange={that.selectFlag}
          placeholder="Change flag"
          className="comment-select"
        />
      </div>
    );

    //WORJKFLOW STATUS SELECT
    const workflow_status_dropdown = (
      <Select
        placeholder="STATUS"
        style={{ width: "100%" }}
        onChange={that.changeWorkflowStatus}
        className="comment-select"
      >
        {that.state.workflowStatuses.length > 0
          ? that.state.workflowStatuses.map(v => {
              return <Option value={v.id}>{v.label}</Option>;
            })
          : null}
      </Select>
    );

    //RISK CODES DROPDOWN
    const risk_codes_dropdown = (
      <Select
        placeholder="RISK CODES"
        style={{ width: "100%" }}
        onChange={that.changeRiskCode}
        className="comment-select"
      >
        <Option value="Association & PEP Risk">Association & PEP Risk</Option>
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
    );

    //INTEGRATIONM STATUS DROPWORN
    const integration_status_dropdown = (
      <Select
        placeholder="STATUS"
        style={{ width: "100%" }}
        onChange={that.changeStatus}
        className="comment-select"
      >
        <Option value="open">Open</Option>
        <Option value="closed">Closed</Option>
      </Select>
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
          height: "calc(100vh - 70px)",
          position: "fixed",
          right: 0,
          top: "60px",
          zIndex: 2
        }}
        width="570"
        collapsed={false}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        trigger={null}
      >
        <div className="comment-details" style={{ width: "570px" }}>
          <Content style={{ background: "#fdfdfd", paddingBottom: "50px" }}>
            {comments.results.length > 0 &&
              comments.results.map(c => {
                if (!single_comments && !_.size(c.messages)) {
                  return null;
                }

                return (
                  <div
                    style={{
                      height: "calc(100vh - 400px)",
                      overflowY: "scroll"
                    }}
                  >
                    {/*///////HEADER///////*/}
                    <StyledHeadContainer>
                      <Row>
                        <Col span={2}>
                          <Icon
                            type="close"
                            onClick={this.toggle}
                            className={css`
                              font-size: 21px;
                              float: left;
                            `}
                          />
                        </Col>

                        <Col span={16}>
                          {c.target.step_group_details ? (
                            <div>
                              <div className="t-22">
                                {
                                  this.props.workflowDetailsHeader
                                    .workflowDetailsHeader.name
                                }
                              </div>

                              <div className="text-lighter mr-top-sm">
                                {c.target.step_group_details.name}
                                <Icon
                                  type="right"
                                  className="small pd-left-sm pd-right-sm"
                                />
                                <span
                                  onClick={that.selectStep.bind(this, c.target)}
                                >
                                  {c.target.step_details.name}
                                </span>
                                <Icon
                                  type="right"
                                  className=" small pd-left-sm pd-right-sm"
                                />
                                {c.target.field_details.name}
                              </div>
                            </div>
                          ) : null}

                          <StyledHeadText>
                            {integrationCommonFunctions.comment_answer_body(c)}
                          </StyledHeadText>
                        </Col>

                        <Col span={6}>
                          {c.target.workflow_details
                            ? c.target.workflow_details
                              ? workflow_status_dropdown
                              : null
                            : null}

                          {c.target.field_details &&
                          c.target.field_details.is_integration_type
                            ? integration_status_dropdown
                            : null}

                          {c.target.field_details &&
                          (c.target.field_details.type == "google_search" ||
                            c.target.field_details.type == "serp_google_search")
                            ? risk_codes_dropdown
                            : null}
                        </Col>
                      </Row>
                    </StyledHeadContainer>

                    {/*///////Comments List Body///////*/}
                    <StyledCommentContainer>
                      {c.messages
                        ? c.messages.map(function(msg, index) {
                            let attachment_text = null;
                            if (msg.attachment) {
                              attachment_text = msg.attachment.split("/")[
                                msg.attachment.split("/").length - 1
                              ];
                              attachment_text = attachment_text.split("?")[0];
                            }
                            return (
                              <div
                                key={msg.id + "-" + index}
                                className="mr-bottom"
                              >
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
                                        <Moment format="MM/DD/YYYY, h:mm a">
                                          {msg.created_at}
                                        </Moment>
                                      }
                                    >
                                      <Moment fromNow>{msg.created_at}</Moment>
                                    </Tooltip>
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    paddingLeft: "32px"
                                  }}
                                >
                                  <div
                                    className="Container"
                                    dangerouslySetInnerHTML={{
                                      __html: msg.message.replace(
                                        /@([a-z\d_]+)/gi,
                                        '<a class="mentions" href="/users/">@$1</a>'
                                      )
                                    }}
                                  />
                                </div>
                                {msg.attachment ? (
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      paddingLeft: "32px",
                                      position: "relative",
                                      top: "-17px"
                                    }}
                                  >
                                    <i class="anticon anticon-paper-clip" />
                                    &nbsp;
                                    <a href={msg.attachment}>
                                      {attachment_text}
                                    </a>
                                  </span>
                                ) : null}
                              </div>
                            );
                          })
                        : null}
                    </StyledCommentContainer>

                    {single_comments ? (
                      <div className="affix-bottom" style={{ width: "100%" }}>
                        <StyledAddCommentContainer>
                          {/*c.target.workflow_details ? (
                            <Col span={10}>
                              {c.target.workflow_details
                                ? workflow_status_dropdown
                                : null}
                            </Col>
                          ) : null*/}

                          <div>
                            {(c.target.field_details ||
                              c.target.workflow_details) &&
                            comments.results
                              ? adjudication
                              : null}
                          </div>

                          <div className="mr-top mr-bottom">
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
                          </div>

                          <Row
                            className={css`
                              margin-top: 30px;
                            `}
                          >
                            <Col span={20} className="text-right">
                              <Upload {...props}>
                                <Icon
                                  type="paper-clip"
                                  style={{
                                    fontSize: "20px",
                                    verticalAlign: "middle"
                                  }}
                                />
                              </Upload>
                            </Col>

                            <Col span={4} className="">
                              <Button
                                type="primary"
                                onClick={() => that.addComment.bind(this)(c)}
                                style={{ float: "right" }}
                              >
                                <FormattedMessage id="stepBodyFormInstances.postButtonText" />
                              </Button>
                            </Col>
                          </Row>
                        </StyledAddCommentContainer>
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

const StyledHeadContainer = styled.div`
  padding: 54px 45px 41px 45px;
  border-bottom: 1px solid #979797;
`;

const StyledHeadText = styled.span`
  font-size: 20px;
  letter-spacing: -0.04px;
  line-height: 24px;
  font-weight: bold;
`;

const StyledCommentContainer = styled.div`
  padding: 32px 54px;
  max-height: calc(100vh - 430px);
`;

const StyledAddCommentContainer = styled.div`
  padding: 30px 46px 30px 30px;
  border-top: 1px solid #979797;
  background: #fafafa;
`;

export default injectIntl(Comments);
