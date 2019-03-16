import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Dropdown,
  Badge,
  Popover,
  List,
  Button,
  Timeline,
  Tooltip
} from "antd";
import _ from "lodash";
import { authHeader, baseUrl } from "../../_helpers";
import Moment from "react-moment";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import PropTypes from "prop-types";
import download from "downloadjs";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AuditList extends Component {
  constructor() {
    super();
    this.state = { data: { results: [], next: null }, activityLoading: true };
  }

  componentDidMount = () => {
    this.loadData();
  };

  loadData = () => {
    let url = this.state.data.next
      ? this.state.data.next
      : baseUrl + "workflows/" + this.props.id + "/activity/";
    //let url = this.state.data.next? this.state.data.next: baseUrl + "activities/";

    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    //let url = baseUrl + "activities/";
    //this.setState({ activityLoading: true });

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        this.appendData(body);
        //this.setState({ data: body, activityLoading: false });
      });
  };

  appendData = body => {
    let oldData = this.state.data.results;
    let newData = body;
    let concatList = oldData.concat(newData.results);
    newData.results = concatList;
    this.setState({ data: newData, activityLoading: false });
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
  id: PropTypes.number.isRequired,
  isFocused: PropTypes.bool,
  actions: PropTypes.array.isRequired,
  logType: PropTypes.string.isRequired
};

const ActivityLogSimple = ({ item }) => {
  return (
    <div>
      <a className="text-medium text-base" href={"mailto:" + item.actor.email}>
        {item.actor.email}
      </a>{" "}
      {item.action.type} {item.object.name}
      <br />
      <span className="small text-light">
        <Tooltip title={item.actiontime.humanize_time}>
          <Moment fromNow>{item.actiontime.datetime}</Moment>
        </Tooltip>
      </span>
    </div>
  );
};

class ActivityLogAlert extends Component {
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
      <div>
        <div>
          <span
            className="float-right text-secondary small text-anchor"
            onClick={this.toggle}
          >
            {this.state.isOpen ? "show less" : "show more"}
          </span>
          {item.actor.email ? (
            <a
              className="text-medium text-base"
              href={"mailto:" + item.actor.email}
            >
              {item.actor.email}
            </a>
          ) : item.actor.username ? (
            item.actor.username
          ) : null}{" "}
          {item.action.type} <b>{item.object.name}</b>
        </div>

        {this.state.isOpen ? (
          <div className="small pd-top-sm pd-bottom-sm">
            <div className="pbs">
              <b>On:</b>{" "}
              <span className="">{item.actiontime.humanize_time}</span>{" "}
            </div>
            <div className="pbs">
              <b>Type:</b>{" "}
              <span className="">{item.object.details.trigger_type}</span>{" "}
            </div>
            <div className="pbs">
              <b>Operator:</b>{" "}
              <span className="">{item.object.details.operator}</span>{" "}
            </div>
          </div>
        ) : null}
        <div>
          <span className="small text-light">
            <Tooltip title={item.actiontime.humanize_time}>
              <Moment fromNow>{item.actiontime.datetime}</Moment>
            </Tooltip>
          </span>
        </div>
      </div>
    );
  }
}

const ActivityLogEmail = ({ item }) => {
  return (
    <p className="pd-left-sm">
      Email{" "}
      {item.object.name ? <span>&#8220;{item.object.name}&#8221;</span> : " "}
      {item.action.type ? item.action.type : item.action.name}{" "}
      <a className="text-medium text-base" href={"mailto:" + item.actor.email}>
        {item.actor.email}
      </a>
      <br />
      <span className="small text-light">
        <Tooltip title={item.actiontime.humanize_time}>
          <Moment fromNow>{item.actiontime.datetime}</Moment>
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
      <div>
        {this.state.activityLoading ? (
          <div className="text-center">loading...</div>
        ) : (
          <AuditContent data={this.state.data} loadData={this.loadData} />
        )}
        <Button
          size={"small"}
          style={{ position: "absolute", top: 0, right: 0, width: "32px" }}
          icon={this.state.isOpen ? "up" : "down"}
          className={"activity-log-collapse-btn"}
        />
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
        hasMore={props.data.next ? true : false}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        useWindow={false}
      >
        <Timeline>
          {_.map(props.data.results, function(item, index) {
            console.log(item);

            let icon = "panorama_fish_eye";
            let color = "blue";

            if (item.action.type === "viewed") {
              icon = "remove_red_eye";
            } else if (item.action.type === "submitted") {
              icon = "check_circle_outline";
              color = "green";
            } else if (item.object.type === "email") {
              icon = "email";
              if (item.action.type === "rejected") {
                color = "red";
              } else if (item.action.type === "delivered") {
                color = "green";
              }
            } else if (item.action.type === "approved") {
              icon = "check_circle_outline";
              color = "green";
            } else if (item.action.type === "undo") {
              icon = "restore";
              color = "orange";
            } else if (item.action.code === "alert_created") {
              icon = "alarm_add";
              color = "red";
            } else if (item.action.code === "alert_dismissed") {
              icon = "alarm_off";
              color = "green";
            }

            return (
              <Timeline.Item
                key={index}
                dot={<i className="material-icons t-14">{icon}</i>}
                color={color}
              >
                {item.object.type === "alert" ? (
                  <ActivityLogAlert item={item} />
                ) : item.object.type === "email" ? (
                  <ActivityLogEmail item={item} />
                ) : item.object.changes && item.object.changes.length === 0 ? (
                  <ActivityLogSimple item={item} />
                ) : (
                  <p className="pd-left-sm">
                    <a
                      className="text-medium text-base"
                      href={"mailto:" + item.actor.email}
                    >
                      {item.actor.email}
                    </a>{" "}
                    {item.action.type} {item.object.name}
                    <br />
                    <span className="small text-light">
                      <Tooltip title={item.actiontime.humanize_time}>
                        <Moment fromNow>{item.actiontime.datetime}</Moment>
                      </Tooltip>
                    </span>
                  </p>
                )}
              </Timeline.Item>
            );

            //cons
          })}
        </Timeline>
      </InfiniteScroll>
    </div>
  );
};

export default AuditList;
