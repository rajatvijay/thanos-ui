import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Cascader,
  Col,
  Icon,
  Layout,
  Row,
  Select,
  Upload
} from "antd";
import { get as lodashGet, size as lodashSize } from "lodash";
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { changeStatusActions } from "../../actions";
import { workflowFiltersService } from "../../services";
import { status_filters } from "./EventStatuses";
import { integrationCommonFunctions } from "./field-types/integration_common";
import MentionWithAttachments from "./MentionWithAttachments";
import showNotification from "../../../modules/common/notification";
import { Timestamp } from "../Navbar/UTCTimestamp";

const { Sider, Content } = Layout;
const Option = Select.Option;

class Comments extends Component {
  state = {
    fileList: [],
    uploading: false,
    workflowStatuses: [],
    message: "",
    mentions: []
  };

  static getWorkflowKind({ workflowComments }) {
    if (!workflowComments) return null;
    return lodashGet(
      workflowComments,
      "data.results[0].target.definition.kind",
      null
    );
  }

  static extractAttachmentName(attachment) {
    if (!attachment) return null;
    let parts = attachment.split("/");
    return parts[parts.length - 1].split("?")[0];
  }

  static getTarget(props) {
    return lodashGet(props, "workflowComments.data.results.0.target", {});
  }

  componentDidMount() {
    const workflowKind = Comments.getWorkflowKind(this.props);
    if (workflowKind) {
      workflowFiltersService
        .getStatusData({ kinds: workflowKind })
        .then(response => {
          this.setState({ workflowStatuses: response });
        });
    }
  }

  componentDidUpdate(previousProps) {
    const currentWorkflowKind = Comments.getWorkflowKind(this.props);
    const previousWorkflowKind = Comments.getWorkflowKind(previousProps);

    if (currentWorkflowKind && currentWorkflowKind !== previousWorkflowKind) {
      workflowFiltersService
        .getStatusData({ kinds: currentWorkflowKind })
        .then(response => {
          this.setState({ workflowStatuses: response });
        });
    }
  }

  componentWillUnmount() {
    this.props.toggleSidebar();
  }

  onChange = (event, value, rawValue, mentions) => {
    this.setState({ message: value, mentions });
  };

  addComment = (comment, message, files) => {
    let content_type = "step";
    if (comment.content_type === "integrationresult") {
      content_type = "integrationresult";
    } else if (comment.target.field_details) {
      content_type = "field";
    } else if (comment.target.workflow_details) {
      content_type = "workflow";
    }

    const {
      fileList: filesFromState,
      message: messageFromState,
      mentions
    } = this.state;
    const fileList = files && files.length ? files : filesFromState;

    const { workflowId, groupId, stepId } = this.props;

    const step_reload_payload = {
      workflowId: workflowId,
      groupId,
      stepId
    };

    const mentionedUsers = [];
    const mentionedGroups = [];

    // Going through all the mentions, breaking them
    // into users and groups
    mentions.forEach(mention => {
      // id is in format of u123 or g123, depending
      // upon whether it's a user or a group.
      const realId = parseInt(mention.id.substr(1));
      if (mention.id.indexOf("u") === 0) {
        // it's a user mention
        mentionedUsers.push(realId);
      } else {
        // it's a group mention
        mentionedGroups.push(realId);
      }
    });

    let commentPayload = {
      object_id: comment.object_id,
      type: content_type,
      mentioned_users: mentionedUsers,
      mentioned_groups: mentionedGroups,
      message: message || messageFromState || "",
      attachment: lodashSize(fileList) ? fileList[0] : ""
    };

    if (
      (!commentPayload.message || !commentPayload.message.trim()) &&
      !commentPayload.attachment
    ) {
      // Don't post any comment if there's nothing in the payload
      showNotification({
        type: "error",
        message: "errorMessageInstances.emptyComment",
        key: "BLANK_COMMENT"
      });
      return;
    }
    this.props.addComment(
      commentPayload,
      step_reload_payload,
      this.props.isEmbedded
    );
    this.setState({ message: "", fileList: [], mentions: [] });
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
    const reason = lodashSize(option) > 1 ? option[1] : "";
    const target = Comments.getTarget(this.props);
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

  changeIntegrationStatus = value => {
    const target = Comments.getTarget(this.props);

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
    const target = Comments.getTarget(this.props);

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
    const target = Comments.getTarget(this.props);

    if (!target.workflow_details) {
      return;
    }
    const fieldExtra = this.props.workflowComments.data.fieldExtra;

    const payload = {
      workflowId: target.workflow_details.id,
      statusId: value,
      addComment: true
    };

    const { workflowId, groupId, stepId } = this.props;

    const step_reload_payload = {
      workflowId: workflowId,
      groupId,
      stepId
    };

    // passing from extra params in payload for calling integration if relevant config is there
    if (
      lodashSize(fieldExtra) &&
      lodashGet(fieldExtra, "call_integration.integration_field_tag", null)
    ) {
      payload["integration_field_tag"] =
        fieldExtra["call_integration"]["integration_field_tag"];
      payload["parent_workflow_id"] = this.props.workflowId;
    }

    this.props.dispatch(
      changeStatusActions(
        payload,
        step_reload_payload,
        this.props.isEmbedded,
        fieldExtra
      )
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

  // Callback for sort method used to alphabetically sort
  // the mentions array.
  sortMentions = (mentionA, mentionB) => {
    const textA = mentionA.display.toUpperCase();
    const textB = mentionB.display.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  };

  getAvailableMentions = commentContext => {
    const userMentions = commentContext.user_mentions || [];
    const groupMentions = commentContext.group_mentions || [];

    // Here we prepare a single array with groups first, followed by uers, each
    // of them sorted alphabetically. Also, ID is apparended with `u` or `g` for
    // users and groups respectively.

    return [
      ...groupMentions
        .map(group => ({ id: "g" + group.id, display: group.name }))
        .sort(this.sortMentions),
      ...userMentions
        .map(user => ({
          id: "u" + user.id,
          display: user.full_name || user.email
        }))
        .sort(this.sortMentions)
    ];
  };

  get hasComments() {
    return lodashGet(this.props, "workflowComments.data.results", []).filter(
      comment => comment.messages.length
    ).length;
  }

  render() {
    const comments = lodashGet(this.props, "workflowComments.data", {});
    // singleContext -> True means that, it's either field comment or step comment.
    // False, simply means that we're loading consolidated comments.
    // In case of True, we'll show things like text-area to add more comments in the same
    // context.
    const { singleContext } = comments;
    const { workflowStatuses, fileList } = this.state;
    const { toggleSidebar } = this.props;

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
      <StyledSider
        className="comments-sidebar profile-sidebar sidebar-right animated slideInRight"
        width="570"
        collapsed={false}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        trigger={null}
      >
        <div className="comment-details" style={{ width: "570px" }}>
          <Content style={{ background: "#fdfdfd", paddingBottom: "50px" }}>
            {!comments.results.length ||
            (!singleContext && !this.hasComments) ? (
              <CommentWrapper singleContext={true}>
                {/*///////HEADER///////*/}
                <StyledCommentHeader>
                  <Row>
                    <Col span={2}>
                      <StyledCloseIcon type="close" onClick={toggleSidebar} />
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
                </StyledCommentHeader>
                <div className="messages">
                  <FormattedMessage id="stepBodyFormInstances.noComments" />
                </div>
              </CommentWrapper>
            ) : (
              comments.results.map((commentContext, index) => {
                if (!singleContext && !lodashSize(commentContext.messages)) {
                  return null;
                }

                const {
                  object_id,
                  messages,
                  target: {
                    field_details,
                    step_group_details,
                    step_details,
                    workflow_details,
                    comment_flag_options
                  }
                } = commentContext;

                const mentions = this.getAvailableMentions(commentContext);

                const { type, is_integration_type, id: fieldId = null } =
                  field_details || {};

                return (
                  <CommentWrapper
                    key={`${object_id}`}
                    singleContext={singleContext}
                  >
                    {/*///////HEADER///////*/}
                    <StyledCommentHeader>
                      <Row>
                        <Col span={2}>
                          <StyledCloseIcon
                            type="close"
                            onClick={toggleSidebar}
                          />
                        </Col>

                        <Col span={16}>
                          {step_group_details ? (
                            <div>
                              <div className="t-22">
                                {
                                  this.props.workflowDetailsHeader
                                    .workflowDetailsHeader.name
                                }
                              </div>

                              <div className="text-lighter mr-top-sm">
                                {step_group_details.name}
                                <Icon
                                  type="right"
                                  className="small pd-left-sm pd-right-sm"
                                />
                                <LinkToStep
                                  groupId={step_group_details.id}
                                  stepId={step_details.id}
                                  fieldId={fieldId || null}
                                  onClick={this.selectStep}
                                >
                                  {step_details.name}
                                </LinkToStep>
                              </div>
                            </div>
                          ) : null}

                          <StyledCommentHeaderText>
                            {integrationCommonFunctions.comment_answer_body(
                              commentContext
                            )}
                          </StyledCommentHeaderText>
                        </Col>

                        <Col span={6}>
                          {workflow_details ? (
                            <WorkflowStatusesDropdown
                              changeWorkflowStatus={this.changeWorkflowStatus}
                              workflowStatuses={workflowStatuses}
                            />
                          ) : null}

                          {is_integration_type ? (
                            <IntegrationStatusDropdown
                              changeIntegrationStatus={
                                this.changeIntegrationStatus
                              }
                            />
                          ) : null}

                          {type === "google_search" ||
                          type === "serp_google_search" ? (
                            <RiskCodesDropdown
                              changeRiskCode={this.changeRiskCode}
                            />
                          ) : null}
                        </Col>
                      </Row>
                    </StyledCommentHeader>

                    {/*///////Comments List Body///////*/}
                    <StyledCommentMessages>
                      {messages
                        ? messages.map(function(msg, index) {
                            return (
                              <Message
                                {...msg}
                                key={msg.created_at}
                                mentions={mentions}
                              />
                            );
                          })
                        : null}
                    </StyledCommentMessages>

                    {singleContext ? (
                      <div className="affix-bottom" style={{ width: "100%" }}>
                        <StyledAddCommentContainer>
                          <div>
                            {(field_details || workflow_details) &&
                            comments.results ? (
                              <AdjudicationCascader
                                options={this.sortedCommentFlag(
                                  comment_flag_options
                                )}
                                onChange={this.selectFlag}
                              />
                            ) : null}
                          </div>

                          <div className="mr-top mr-bottom">
                            <MentionWithAttachments
                              comment={commentContext}
                              addComment={this.addComment}
                              placeholder={this.props.intl.formatMessage({
                                id: "stepBodyFormInstances.enterComment"
                              })}
                              onChange={this.onChange}
                              message={this.state.message}
                              mentions={mentions}
                              addAttachement={this.addAttachementInState}
                            />
                          </div>

                          <StyledAddCommentFooter>
                            <Col span={20} className="text-right">
                              <Upload {...props}>
                                <StyledAttachmentIcon type="paper-clip" />
                              </Upload>
                            </Col>

                            <Col span={4}>
                              <PostButton
                                commentContext={commentContext}
                                onClick={this.addComment}
                              />
                            </Col>
                          </StyledAddCommentFooter>
                        </StyledAddCommentContainer>
                      </div>
                    ) : null}
                  </CommentWrapper>
                );
              })
            )}
          </Content>
        </div>
      </StyledSider>
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

const PostButton = React.memo(({ commentContext, onClick, ...otherProps }) => (
  <Button
    style={{ width: "100%" }}
    type="primary"
    onClick={() => onClick(commentContext)}
    {...otherProps}
  >
    <FormattedMessage id="stepBodyFormInstances.postButtonText" />
  </Button>
));

const Message = React.memo(
  ({ posted_by, created_at, attachment, message, mentions = [] }) => {
    let transformedMessage = message;

    // Generic format regex only checks for the format of the tags,
    // regardless of data.
    const genericFormatRegEx = new RegExp(
      `~\\[([^\\]]*)\\]\\((u|g)\\d+\\)`,
      "gm"
    );

    // Go through each of the mentions, and find them in message,
    // while wrapping them in a tag to make it look highlighted.
    for (let mention of mentions) {
      const { display, id } = mention;
      if (transformedMessage.indexOf("(" + id + ")") === -1) continue;
      // We only look for the ID and ignore the name that was originally
      // in the message because we map it with the current name that we
      // get in mentions from the API
      const lookForRegEx = new RegExp(`~\\[[^\\]]*\\]\\(${id}\\)`, "gm");

      // Now we replace all occurrences of that in the message string.
      transformedMessage = transformedMessage.replace(
        lookForRegEx,
        `<span class="mentions">@${display}</span>`
      );

      // To make it look from the very beginning, every single time.
      genericFormatRegEx.lastIndex = 0;

      // If we don't have any more @ mentions that are not already
      // taken care of then we can quit the loop.
      if (!genericFormatRegEx.test(transformedMessage)) break;
    }

    // Replace left out mentions in cases like user was removed later after
    // the comment was posted.
    // The reason we don't do this up there is because username or group-name
    // may have changed, so we display the one that we get in mentions within
    // API. But in this case, since the user/group doesn't exist in current
    // context, we display the one that was added initially in the comment.

    transformedMessage = transformedMessage.replace(
      genericFormatRegEx,
      "<strong><em>@$1</em></strong>"
    );

    return (
      <div className="mr-bottom">
        <Avatar size="small" icon="user" style={{ float: "left" }} />
        <StyledMessageRow>
          <b style={{ color: "#162c5b" }}>
            {posted_by.first_name || posted_by.email}
          </b>
          <StyledCommentTimestamp>
            <Timestamp timestamp={created_at} />
          </StyledCommentTimestamp>
        </StyledMessageRow>
        <StyledMessageBody>
          <div
            className="Container"
            dangerouslySetInnerHTML={{
              __html: transformedMessage
            }}
          />
        </StyledMessageBody>
        {attachment ? (
          <StyledMessageRow>
            <i className="anticon anticon-paper-clip" />
            &nbsp;
            <a href={attachment}>
              {Comments.extractAttachmentName(attachment)}
            </a>
          </StyledMessageRow>
        ) : null}
      </div>
    );
  }
);

const AdjudicationCascader = React.memo(
  injectIntl(({ onChange, intl, options }) => (
    <div>
      <div className="t-16 text-light">
        <FormattedMessage id="workflowsInstances.comments.adjudication" />:
      </div>
      <Cascader
        style={{ width: "100%", marginTop: "6px" }}
        options={options}
        onChange={onChange}
        placeholder={intl.formatMessage({
          id: "workflowsInstances.comments.riskCodes"
        })}
        className="comment-select"
      />
    </div>
  ))
);

const WorkflowStatusesDropdown = React.memo(
  injectIntl(({ changeWorkflowStatus, workflowStatuses, intl }) => (
    <Select
      placeholder={intl.formatMessage({
        id: "workflowFiltersTranslated.filterPlaceholders.status"
      })}
      style={{ width: "100%" }}
      onChange={changeWorkflowStatus}
      className="comment-select"
    >
      {workflowStatuses.length > 0
        ? workflowStatuses.map((status, index) => (
            <Option key={`${index}`} value={status.id}>
              {status.label}
            </Option>
          ))
        : null}
    </Select>
  ))
);

const RiskCodesDropdown = React.memo(
  injectIntl(({ changeRiskCode, intl }) => (
    <Select
      placeholder={intl
        .formatMessage({ id: "workflowsInstances.comments.riskCodes" })
        .toUpperCase()}
      style={{ width: "100%" }}
      onChange={changeRiskCode}
      className="comment-select"
    >
      <Option value="Association & PEP Risk">
        <FormattedMessage id="stepBodyFormInstances.associationRisk" />
      </Option>
      <Option value="Criminal Risk">
        <FormattedMessage id="stepBodyFormInstances.criminalRisk" />
      </Option>
      <Option value="Financial Condition Risk">
        <FormattedMessage id="stepBodyFormInstances.financialRisk" />
      </Option>
      <Option value="Legal Risk">
        <FormattedMessage id="stepBodyFormInstances.legalRisk" />
      </Option>
      <Option value="Prohibited Entities Risk">
        <FormattedMessage id="stepBodyFormInstances.prohibitedEntitiesRisk" />
      </Option>
      <Option value="Regulatory Risk">
        <FormattedMessage id="stepBodyFormInstances.regulatorRisk" />
      </Option>
      <Option value="Reputation Risk">
        <FormattedMessage id="stepBodyFormInstances.reputationRisk" />
      </Option>
    </Select>
  ))
);

const IntegrationStatusDropdown = React.memo(
  injectIntl(({ changeIntegrationStatus, intl }) => (
    <Select
      placeholder={intl.formatMessage({
        id: "workflowFiltersTranslated.filterPlaceholders.status"
      })}
      style={{ width: "100%" }}
      onChange={changeIntegrationStatus}
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
  ))
);

const StyledSider = styled(Sider)`
  background: #fff;
  height: calc(100vh - 60px);
  position: fixed;
  right: 0;
  top: 60px;
  overflow-y auto;
  overflow-x: hidden;
  z-index: 20;
`;

const StyledLinkToStep = styled.span`
  color: #148cd6;
  cursor: pointer;
`;

const CommentWrapper = styled.div`
  height: ${({ singleContext }) =>
    singleContext ? "calc(100vh - 400px);" : "auto"};
  overflow-y: ${({ singleContext }) => (singleContext ? "scroll" : "auto")};
`;

const StyledCommentHeader = styled.div`
  padding: 54px 45px 41px 45px;
  border-bottom: 1px solid #979797;
`;

const StyledCloseIcon = styled(Icon)`
  font-size: 21px;
  float: left;
`;

const StyledCommentHeaderText = styled.span`
  font-size: 20px;
  letter-spacing: -0.04px;
  line-height: 24px;
  font-weight: bold;
`;

const StyledCommentMessages = styled.div`
  padding: 32px 54px;
`;

const StyledMessageBody = styled.div`
  font-size: 12px;
  padding-left: 32px;
`;

const StyledMessageRow = styled.div`
  margin-left: 30px;
  font-size: 12px;
  padding: 2px 0px 3px;
`;

const StyledCommentTimestamp = styled.span`
  font-size: 11px;
  margin-left: 6px;
  cursor: pointer;
`;

const StyledAddCommentContainer = styled.div`
  padding: 30px 46px 30px 30px;
  border-top: 1px solid #979797;
  background: #fafafa;
`;

const StyledAddCommentFooter = styled(Row)`
  margin-top: 30px;
`;

const StyledAttachmentIcon = styled(Icon)`
  font-size: 20px;
  margin-right: 20px;
  vertical-align: middle;
`;

export default injectIntl(Comments);
