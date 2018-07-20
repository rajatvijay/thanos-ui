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
    <div
      className="activity-log-wrapper pd-ard-lg text-left"
      style={{ overflow: "hidden" }}
      //style={{ maxWidth: "300px", maxHeight: "500px", overflow: "auto" }}
    >
      <Scrollbars
        autoHide={true}
        autoWidth
        style={{ width: 260, height: "100vh" }}
      >
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
              //return <div>------------</div>;
              let icon = "panorama_fish_eye";
              if (item.action.type === "viewed") {
                icon = "remove_red_eye";
              } else if (item.action.type === "submitted") {
                icon = "check_circle_outline";
              } else if (item.object.type === "email") {
                icon = "email";
              } else if (item.action.type === "approved") {
                icon = "check_circle_outline";
              } else if (item.action.type === "undo") {
                icon = "restore";
              }

              return (
                <Timeline.Item
                  key={index}
                  dot={<i className="material-icons t-14">{icon}</i>}
                >
                  {item.object.type === "email" ? (
                    <p className="pd-left-sm">
                      Email &#8220;{item.object.name}&#8221;{" "}
                      {item.action.type ? item.action.type : item.action.name}{" "}
                      <a
                        className="text-medium text-base"
                        href={"mailto:" + item.actor.email}
                      >
                        {item.actor.email}
                      </a>
                      <br />
                      <span className="small text-light">
                        <Tooltip title={item.actiontime.humanize_time}>
                          <Moment fromNow>{item.actiontime.datetime}</Moment>
                        </Tooltip>
                      </span>
                    </p>
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
      </Scrollbars>
    </div>
  );
};

export default AuditList;
