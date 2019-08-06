import React, { Component } from "react";
import { Button, Icon, Tabs, Timeline, Tooltip, notification } from "antd";
import _ from "lodash";
import { requestOptions } from "../../services/auth-header-auditlog-service";
import Moment from "react-moment";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import PropTypes from "prop-types";
import download from "downloadjs";
import { serverlessAPIFetch } from "../../utils/request";

const TabPane = Tabs.TabPane;

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

class ServerlessAuditListTabs extends Component {
  static ACTIVITY_ACTION_GROUPS = {
    edits: [
      "step_submitted",
      "step_undo",
      "step_approved",
      "response_changed",
      "child_workflow_created"
    ],
    emails: ["sendgrid_email"],
    views: ["step_viewed", "workflow_viewed"],
    alerts: ["alert_created", "alert_dismissed"]
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTab: "edits"
    };
  }

  onTabChange = key => {
    this.setState({
      currentTab: key
    });
  };

  downloadFile = () => {
    function getFileName(resp) {
      const filename = resp.headers.get("Content-Disposition");
      return filename && (filename.match(/filename="(.*)"/) || []).pop();
    }

    const url = `workflows/activity/export?workflows=${this.props.id}`;
    return serverlessAPIFetch(url, requestOptions(), "AUDIT_LOG").then(function(
      resp
    ) {
      resp.blob().then(function(blob) {
        // Allowing filename and MIME type to be decided by the backend
        // though it's possible to specify here
        download(
          blob,
          getFileName(resp) ||
            "activity_log_" + moment().format("YYYY-MM-DD") + ".xlsx"
        );
      });
    });
  };

  render = () => {
    return (
      <Tabs defaultActiveKey="edits" onChange={this.onTabChange}>
        {Object.entries(ServerlessAuditListTabs.ACTIVITY_ACTION_GROUPS).map(
          ([key]) => {
            return (
              <TabPane
                tab={<span style={{ textTransform: "capitalize" }}>{key}</span>}
                key={key}
              >
                <AuditList
                  actions={ServerlessAuditListTabs.ACTIVITY_ACTION_GROUPS[key]}
                  isFocused={this.state.currentTab === key}
                  logType={key}
                  id={this.props.id}
                />
              </TabPane>
            );
          }
        )}
        <TabPane
          isFocused={this.state.currentTab === "download"}
          key="download"
          tab={
            <span>
              Download all <Icon type="download" />
            </span>
          }
        >
          <div className="text-center mr-top-lg">
            <br />
            <span
              onClick={this.downloadFile}
              className="text-secondary text-anchor"
            >
              <Icon type="download" style={{ fontSize: 30 }} />
            </span>
            <br />
            <div className="mr-top t-12 text-light">
              Click above to download the activity log file.
            </div>
          </div>
        </TabPane>
      </Tabs>
    );
  };
}

ServerlessAuditListTabs.propTypes = {
  id: PropTypes.array.isRequired
};

class AuditList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        results: [],
        next: null
      },
      activityLoading: true,
      initialLoad: true
    };
  }

  loadData = () => {
    const initUrl = `workflows/activity/?workflows=${
      this.props.id
    }&actions=${this.props.actions.join(",")}`;
    const url = this.state.data.next
      ? `${initUrl}&from=${this.state.data.next}`
      : initUrl;
    serverlessAPIFetch(url, requestOptions(), "AUDIT_LOG")
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          response.json().then(data => {
            this.appendData(data);
          });
        }
      })
      .catch(err => {
        openNotificationWithIcon({
          type: "error",
          message: "Error in getting activity logs!"
        });
      });
  };

  appendData = body => {
    const oldData = this.state.data.results;
    const newData = body;
    newData.results = oldData.concat(newData.results);
    this.setState({
      data: newData,
      activityLoading: false,
      initialLoad: false
    });
  };

  hasMore = () => {
    let _hasMore = false;
    if (this.state.initialLoad) {
      _hasMore = true;
    } else {
      _hasMore = !!this.state.data.next; // next can be null, undefined or a string
    }
    return _hasMore;
  };

  render = () => {
    if (this.props.isFocused) {
      if (!this.state.initialLoad && this.state.data.results.length === 0) {
        return (
          <div style={{ textAlign: "center" }}>
            <Icon type={"exclamation-circle"} />{" "}
            {`No activity log found for ${this.props.logType}`}
          </div>
        );
      } else {
        return (
          <div>
            <AuditContent
              data={this.state.data}
              hasMore={this.hasMore}
              loadData={this.loadData}
            />
          </div>
        );
      }
    } else {
      return null;
    }
  };
}

AuditList.propTypes = {
  id: PropTypes.array.isRequired,
  isFocused: PropTypes.bool,
  actions: PropTypes.array.isRequired,
  logType: PropTypes.string.isRequired
};

const ActivityLogSimple = ({ item }) => {
  return (
    <div>
      <a className="text-medium text-base" href={"mailto:" + item.actor_email}>
        {item.actor_email}
      </a>{" "}
      {item.action_type} {item.object_name}
      <br />
      <span className="small text-light">
        <Tooltip title={moment(item.timestamp.$date).format()}>
          <Moment fromNow>{item.timestamp.$date}</Moment>
        </Tooltip>
      </span>
    </div>
  );
};

const ActivityLogEmail = ({ item }) => {
  return (
    <p className="pd-left-sm">
      Email{" "}
      {item.object_name ? <span>&#8220;{item.object_name}&#8221;</span> : " "}
      {item.action_type ? item.action_type : item.action_code}{" "}
      <a className="text-medium text-base" href={"mailto:" + item.actor_email}>
        {item.actor_email}
      </a>
      <br />
      <span className="small text-light">
        <Tooltip title={moment(item.timestamp.$date).format()}>
          <Moment fromNow>{item.timestamp.$date}</Moment>
        </Tooltip>
      </span>
    </p>
  );
};

class ActivityLogCollapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const item = this.props.item;
    return (
      <div onClick={this.toggle}>
        <ActivityLogSimple item={item} />
        {this.state.isOpen && (
          <Timeline style={{ paddingTop: 20, marginBottom: -20 }}>
            {_.map(item.changes, (change, index) => {
              return (
                <Timeline.Item
                  style={{ paddingBottom: 10 }}
                  key={`item_${index}`}
                >
                  {change.event}
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
        {item.changes.length > 0 ? (
          <Button
            size={"small"}
            style={{ position: "absolute", top: 0, right: 0, width: "32px" }}
            icon={this.state.isOpen ? "up" : "down"}
            className={"activity-log-collapse-btn"}
          />
        ) : null}
      </div>
    );
  }
}

const AuditContent = props => {
  return (
    <div className="activity-log-wrapper text-left">
      <InfiniteScroll
        pageStart={0}
        loadMore={props.loadData}
        hasMore={props.hasMore()}
        loader={
          <div className="loader" key={0}>
            <Icon type={"loading"} />
          </div>
        }
        useWindow={false}
        initialLoad={true}
      >
        <Timeline>
          {_.map(props.data.results, function(item, index) {
            let icon = "panorama_fish_eye";
            let color = "blue";

            if (item.action_type === "viewed") {
              icon = "remove_red_eye";
            } else if (item.action_type === "submitted") {
              icon = "check_circle_outline";
              color = "green";
            } else if (item.object_type === "email") {
              icon = "email";
              if (item.action_type === "rejected") {
                color = "red";
              } else if (item.action_type === "delivered") {
                color = "green";
              }
            } else if (item.action_type === "approved") {
              icon = "check_circle_outline";
              color = "green";
            } else if (item.action_type === "undo") {
              icon = "restore";
              color = "orange";
            } else if (item.action_code === "alert_created") {
              icon = "alarm_add";
              color = "red";
            } else if (item.action_code === "alert_dismissed") {
              icon = "alarm_off";
              color = "green";
            }

            return (
              <Timeline.Item
                key={`item_${index}`}
                dot={<i className="material-icons t-14">{icon}</i>}
                color={color}
              >
                {item.object_type === "alert" ? (
                  <ActivityLogCollapsible item={item} />
                ) : item.object_type === "email" ? (
                  <ActivityLogEmail item={item} />
                ) : item.changes && item.changes.length === 0 ? (
                  <ActivityLogSimple item={item} />
                ) : (
                  <ActivityLogCollapsible item={item} />
                )}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </InfiniteScroll>
    </div>
  );
};

export default ServerlessAuditListTabs;
