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
  Menu,
  Dropdown
} from "antd";
import { Link } from "react-router-dom";
import { workflowDetailsActions } from "../../actions";
import { integrationCommonFunctions } from "./field-types/integration_common";
import _ from "lodash";
import Moment from "react-moment";
import { FormattedMessage, injectIntl } from "react-intl";

const { toString, toContentState } = Mention;

const { Sider, Content } = Layout;
const Option = Select.Option;

class Comments extends Component {
  constructor(props) {
    super();
    this.state = { message: toContentState("") };
    // call action
  }

  callback = key => {};

  toggle = () => {
    this.props.toggleSidebar();
  };

  onChange = value => {
    this.state.comment = toString(value);
    this.setState({ message: value });
  };

  addComment = c => {
    let content_type = "step";
    if (c.content_type == "integrationresult") {
      content_type = "integrationresult";
    } else if (c.target.field_details) {
      content_type = "field";
    } else if (c.target.workflow_details) {
      content_type = "workflow";
    }

    console.log(content_type);
    this.props.addComment({
      object_id: c.object_id,
      type: content_type,
      message: this.state.comment
    });
    this.setState({ message: toContentState("") });
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

  selectFlag = flag => {
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let target = _.size(comments.results) ? comments.results[0].target : {};
    let payload = {
      workflow: target.workflow,
      field: target.field_details.id,
      flag: parseInt(flag.key)
    };
    if (target.field_details.is_integration_type) {
      payload["integration_uid"] = target.uid;
    }
    this.props.changeFlag(payload);
  };

  render() {
    const Panel = Collapse.Panel;
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let that = this;
    let single_comments = _.size(comments.results) <= 1 ? true : false;

    let c = _.size(comments.results) ? comments.results[0] : [];
    let flag_dropdown = (
      <Menu onClick={that.selectFlag}>
        {_.map(c.target.comment_flag_options, function(cfo) {
          let text_color_css = cfo.extra.color
            ? { color: cfo.extra.color }
            : {};
          return (
            <Menu.Item key={cfo.value}>
              <i
                className="material-icons t-18 "
                style={{
                  verticalAlign: "text-bottom",
                  color: text_color_css.color
                }}
              >
                fiber_manual_record
              </i>{" "}
              {cfo.label}
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <Sider
        className="comments-sidebar profile-sidebar sidebar-right"
        style={{
          background: "#fff",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          right: 0,
          top: "65px",
          zIndex: 1
        }}
        width="400"
        collapsed={false}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        trigger={null}
      >
        <div className="comment-details" style={{ width: "400px" }}>
          <div
            className="sidebar-head"
            //style={{ background: "#18eada", color: "#000" }}
          >
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
                <div>
                  {c.target.field_details && comments.results ? (
                    <div
                      style={{
                        position: "absolute",
                        right: "21px",
                        zIndex: "1"
                      }}
                    >
                      <Dropdown overlay={flag_dropdown}>
                        <a
                          className="ant-dropdown-link text-nounderline text-secondary"
                          href="#"
                        >
                          <i className="material-icons text-middle t-16">
                            flag
                          </i>{" "}
                          <Icon type="down" />
                        </a>
                      </Dropdown>
                    </div>
                  ) : null}

                  <Tag style={{ width: "100%" }} className="comment_step_bar">
                    <span>{c.target.step_group_details.name}</span>
                    <span> > </span>
                    <span onClick={that.selectStep.bind(this, c.target)}>
                      {c.target.step_details.name}
                    </span>
                  </Tag>

                  {integrationCommonFunctions.comment_answer_body(c)}

                  <Divider />

                  {single_comments || c.messages.length ? (
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
                  ) : null}

                  <div style={{ position: "relative", top: "-30px" }}>
                    {_.map(c.messages, function(msg) {
                      return (
                        <div key={msg.id}>
                          <Avatar
                            size="small"
                            icon="user"
                            style={{ float: "left" }}
                          />
                          <div
                            style={{
                              marginLeft: "30px",
                              fontSize: "13px",
                              padding: "2px 0px 3px"
                            }}
                          >
                            <b>
                              {msg.posted_by.first_name !== ""
                                ? msg.posted_by.first_name
                                : msg.posted_by.email}
                            </b>
                            <span
                              style={{ fontSize: "11px", marginLeft: "6px" }}
                            >
                              <Moment fromNow>{msg.created_at}</Moment>
                            </span>
                          </div>
                          <p style={{ fontSize: "14px", paddingLeft: "32px" }}>
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
                        </div>
                      );
                    })}
                  </div>

                  {single_comments ? (
                    <span>
                      <div style={{ position: "relative", top: "-20px" }}>
                        <Mention
                          style={{ width: "100%", height: 60 }}
                          suggestions={c.mentions}
                          placeholder={that.props.intl.formatMessage({
                            id: "stepBodyFormInstances.enterComment"
                          })}
                          multiLines
                          onChange={that.onChange}
                          value={that.state.message}
                          notFoundContent={"user not found"}
                        />
                      </div>
                      <Button
                        className="float-right"
                        style={{ marginTop: "-8px" }}
                        onClick={that.addComment.bind(this, c)}
                      >
                        <FormattedMessage id="stepBodyFormInstances.postButtonText" />
                      </Button>{" "}
                    </span>
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
