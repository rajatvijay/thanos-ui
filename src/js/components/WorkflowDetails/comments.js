import React, { Component } from "react";
import moment from "moment";
import {
  Layout,
  Icon,
  Select,
  Avatar,
  Button,
  Mention,
  Row,
  Col,
  Cascader,
  Upload,
  Tooltip
} from "antd";
import { changeStatusActions } from "../../actions";
import { integrationCommonFunctions } from "./field-types/integration_common";
import { size, get } from "lodash";
import Moment from "react-moment";
import { FormattedMessage, injectIntl } from "react-intl";
import MentionWithAttachments from "./MentionWithAttachments";
import { workflowFiltersService } from "../../services";
import styled from "@emotion/styled";
import { css } from "emotion";
import { status_filters } from "./EventStatuses";

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
        .getStatusData({ kinds: workflowKind })
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
        .getStatusData({ kinds: currentWorkflowKind })
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
    if (c.content_type === "integrationresult") {
      content_type = "integrationresult";
    } else if (c.target.field_details) {
      content_type = "field";
    } else if (c.target.workflow_details) {
      content_type = "workflow";
    }

    const { fileList: filesFromState } = this.state;
    const fileList = files && files.length ? files : filesFromState;

    const workflowId = this.props.workflowId;

    const step_reload_payload = {
      workflowId: workflowId,
      groupId: this.props.workflowKeys[workflowId].groupId,
      stepId: this.props.workflowKeys[workflowId].stepId
    };

    this.props.addComment(
      {
        object_id: c.object_id,
        type: content_type,
        message: message || this.state.comment,
        attachment: size(fileList) ? fileList[0] : ""
      },
      step_reload_payload,
      this.props.isEmbedded
    );
    this.setState({ message: toContentState(""), fileList: [] });
  };

  selectStep = ({ groupId, stepId, fieldId = null }) => {
    this.props.toggleSidebar(); // closing the sidebar

    this.props.selectActiveStep(groupId, stepId);

    if (fieldId !== null) {
      this.props.toggleSidebar(fieldId, "field");
    } else {
      this.props.toggleSidebar(stepId, "step");
    }
  };

  selectFlag = option => {
    const flag = option[0];
    const reason = size(option) > 1 ? option[1] : "";
    const comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    const target = size(comments.results) ? comments.results[0].target : {};

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
    const comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    const target = size(comments.results) ? comments.results[0].target : {};

    if (!target.field_details.is_integration_type) {
      return;
    }
    const payload = {
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
    const comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    const target = size(comments.results) ? comments.results[0].target : {};

    if (!target.field_details.is_integration_type) {
      return;
    }
    const payload = {
      krypton_risk_code: value,
      field_id: target.field,
      row_uid: target.uid,
      changed_key: "krypton_risk_code",
      display_item: "Risk Code"
    };

    this.props.changeIntegrationStatus(payload);
  };

  changeWorkflowStatus = value => {
    const comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    const target = size(comments.results) ? comments.results[0].target : {};

    if (!target.workflow_details) {
      return;
    }

    const payload = {
      workflowId: target.workflow_details.id,
      statusId: value,
      addComment: true
    };

    const workflowId = this.props.workflowId;

    const step_reload_payload = {
      workflowId: workflowId,
      groupId: this.props.workflowKeys[workflowId].groupId,
      stepId: this.props.workflowKeys[workflowId].stepId
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
    const comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    const that = this;
    const single_comments = size(comments.results) <= 1 ? true : false;
    const resultsCount = size(comments.results);
    const c = resultsCount ? comments.results[0] : [];

    //ADJUDICATION SELECTION
    const adjudication = resultsCount ? (
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
    ) : null;

    //WORJKFLOW STATUS SELECT
    const workflow_status_dropdown = (
      <Select
        placeholder="STATUS"
        style={{ width: "100%" }}
        onChange={that.changeWorkflowStatus}
        className="comment-select"
      >
        {that.state.workflowStatuses.length > 0
          ? that.state.workflowStatuses.map((v, index) => {
              return (
                <Option key={`${index}`} value={v.id}>
                  {v.label}
                </Option>
              );
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
        {status_filters.map((item, index) => {
          return (
            <Option key={`${index}`} value={item.value}>
              {item.text}
            </Option>
          );
        })}
      </Select>
    );

    // for comment attachments
    const { fileList } = this.state;
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
          height: "calc(100vh - 60px)",
          position: "fixed",
          right: 0,
          top: "60px",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 20
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
            {comments.results.length <= 0 ? (
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
                      <div>
                        <div className="t-22">
                          {
                            this.props.workflowDetailsHeader
                              .workflowDetailsHeader.name
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                </StyledHeadContainer>
                <StyledCommentContainer>No comments</StyledCommentContainer>
              </div>
            ) : (
              comments.results.map((c, index) => {
                if (!single_comments && !size(c.messages)) {
                  return null;
                }

                return (
                  <div
                    key={`${c.object_id}`}
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
                                <LinkToStep
                                  groupId={c.target.step_group_details.id}
                                  stepId={c.target.step_details.id}
                                  fieldId={get(
                                    c,
                                    "target.field_details.id",
                                    null
                                  )}
                                  onClick={this.selectStep}
                                >
                                  {c.target.step_details.name}
                                </LinkToStep>
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
                          (c.target.field_details.type === "google_search" ||
                            c.target.field_details.type ===
                              "serp_google_search")
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
                                      title={moment(msg.created_at).format()}
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
                                  <div
                                    style={{
                                      marginLeft: "30px",
                                      fontSize: "12px",
                                      padding: "2px 0px 3px"
                                    }}
                                  >
                                    <i className="anticon anticon-paper-clip" />
                                    &nbsp;
                                    <a href={msg.attachment}>
                                      {attachment_text}
                                    </a>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        : null}
                    </StyledCommentContainer>

                    {single_comments ? (
                      <div className="affix-bottom" style={{ width: "100%" }}>
                        <StyledAddCommentContainer>
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
              })
            )}
          </Content>
        </div>
      </Sider>
    );
  }
}

/**
 * Simple wrapper component that creates a link to the step
 * that we want to navigate to.
 *
 * @param groupId Group ID of denoted target
 * @param stepId Step ID of denoted target
 * @param fieldId (Optional) Field ID of denoted target
 * @param children React child component(s)
 * @param onClick Function that will be called upon click with params
 * @returns {React.DetailedReactHTMLElement<any, HTMLElement>[]}
 * @private
 */
const LinkToStep = React.memo(
  ({ groupId, stepId, fieldId, children, onClick }) => {
    return (
      <StyledLinkToStep
        onClick={onClick.bind(null, {
          groupId,
          stepId,
          fieldId
        })}
      >
        {children}
      </StyledLinkToStep>
    );
  }
);

const StyledLinkToStep = styled.span`
  color: #148cd6;
  cursor: pointer;
`;

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
