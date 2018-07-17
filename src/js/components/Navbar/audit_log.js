import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Dropdown,
  Badge,
  Popover,
  List,
  Avatar
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
        console.log("body----");
        console.log(body);

        this.appendData(body);

        //this.setState({ data: body, activityLoading: false });
      });
  };

  appendData = body => {
    let oldData = this.state.data.results;
    let newData = body;
    let concatList = oldData.concat(newData.results);
    newData.results = concatList;

    console.log("newData");
    console.log(newData);

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
      className="activity-log-wrapper pd-ard-lg"
      //style={{ maxWidth: "300px", maxHeight: "500px", overflow: "auto" }}
    >
      <Scrollbars autoHide={true} style={{ width: "300px", height: "500px" }}>
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
          <List itemLayout="vertical" size="small">
            {_.map(props.data.results, function(item, index) {
              console.log("item---");
              console.log(item);
              //return <div>------------</div>;
              return (
                <List.Item key={index}>
                  <List.Item.Meta
                    //avatar={<Avatar>{item.actor.first_name.charAt(0)}</Avatar>}
                    title={<a href="">{item.action_title}</a>}
                    description={item.message}
                  />
                  <div className="text-right text-light small">
                    <Moment fromNow>{item.datetime}</Moment>
                  </div>
                </List.Item>
              );
              //cons
            })}
          </List>
        </InfiniteScroll>
      </Scrollbars>
    </div>
  );
};

export default AuditList;
