import React, { Component } from "react";
import {
  Layout,
  Icon,
  Avatar,
  Collapse,
  Button,
  Breadcrumb,
  Tag,
  Mention,
  Divider
} from "antd";
import { Link } from "react-router-dom";
import { workflowDetailsActions } from "../../actions";
import _ from "lodash";
import Moment from "react-moment";
const { toString, toContentState } = Mention;

const { Sider, Content } = Layout;

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
    if (c.target.field_details) {
      content_type = "field";
    } else if (c.target.workflow_details) {
      content_type = "workflow";
    }
    this.props.addComment({
      object_id: c.object_id,
      type: content_type,
      message: this.state.comment
    });
    this.setState({ message: toContentState("") });
  };

  render() {
    const Panel = Collapse.Panel;
    let comments = this.props.workflowComments
      ? this.props.workflowComments.data
      : {};
    let that = this;
    let single_comments = _.size(comments.results) <= 1 ? true : false;
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
            style={{ background: "#18eada", color: "#000" }}
          >
            <span className="sidebar-title">Comments</span>
            <Icon
              type="close"
              onClick={this.toggle}
              style={{ float: "right", marginTop: "4px" }}
            />
          </div>
          <Content style={{ padding: "15px" }}>
            {_.map(comments.results, function(c) {
              if (!single_comments && !_.size(c.messages)) {
                return null;
              }
              return (
                <div>
                  <Tag style={{ width: "100%" }} className="comment_step_bar">
                    <span>{c.target.step_group_details.name}</span>
                    <span> > </span>
                    <span>{c.target.step_details.name}</span>
                  </Tag>

                  {c.target.field_details ? (
                    <div
                      className="ant-form-item-label"
                      style={{ marginTop: "5px" }}
                    >
                      <div style={{ fontSize: "14px", textAlign: "left" }}>
                        {c.target.field_details.name}
                      </div>
                      <div style={{ textAlign: "left", fontSize: "13px" }}>
                        {_.size(c.target.field_details.answer)
                          ? c.target.field_details.answer[0].answer
                          : "-"}
                      </div>
                    </div>
                  ) : null}

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
                        {c.messages.length
                          ? c.messages.length + " Comment/s"
                          : "Comments"}{" "}
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
                            <b>{msg.posted_by.first_name}</b>
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
                          placeholder="Enter comment"
                          multiLines
                          onChange={that.onChange}
                          value={that.state.message}
                        />
                      </div>
                      <Button
                        className="float-right"
                        style={{ marginTop: "-8px" }}
                        onClick={that.addComment.bind(this, c)}
                      >
                        Post
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

export default Comments;
