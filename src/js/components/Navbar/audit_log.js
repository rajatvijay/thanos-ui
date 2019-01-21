import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Dropdown,
  Badge,
  Popover,
  List,
  Timeline,
  Tooltip
} from "antd";
import _ from "lodash";
import { authHeader, baseUrl } from "../../_helpers";
import Moment from "react-moment";
import { Scrollbars } from "react-custom-scrollbars";
import InfiniteScroll from "react-infinite-scroller";

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
    return (
      <div>
        {this.state.activityLoading ? (
          <div className="text-center">loading...</div>
        ) : (
          <AuditContent data={this.state.data} loadData={this.loadData} />
        )}
      </div>
    );
  };
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
            }

            return (
              <Timeline.Item
                key={index}
                dot={<i className="material-icons t-14">{icon}</i>}
                color={color}
              >
                {item.object.type === "email" ? (
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
