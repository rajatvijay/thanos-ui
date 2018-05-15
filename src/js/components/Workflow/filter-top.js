import React, { Component } from "react";
import { baseUrl, authHeader } from "../../_helpers";
import { Select, Spin, Layout, Icon, Tooltip, Menu } from "antd";
import debounce from "lodash.debounce";
import { workflowFiltersActions } from "../../actions";
import _ from "lodash";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class WorkflowFilterTop extends Component {
  constructor(props) {
    super(props);
    // this.lastFetchId = 0;
    // this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    fetching: false,
    countData: null
  };

  handleClick = value => {
    let payload = { filterType: "stepgroupdef", filterValue: [value.key] };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentDidMount = () => {
    this.fetchCountData();
  };

  fetchCountData = () => {
    this.setState({ fetching: true });

    const tag = this.props.tag;

    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    fetch(baseUrl + "workflow-kinds/" + tag + "/count/", requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({ data: body, fetching: false });
      });
  };

  setitem(item) {
    console.log(item);
  }

  render() {
    let that = this;
    const { fetching, data } = this.state;

    return (
      <div className="filter-top">
        {!fetching ? (
          <Menu onClick={this.handleClick} mode="horizontal">
            {_.map(data.stepgroupdef_counts, function(item, index) {
              return (
                <Menu.Item key={item.id} className="text-grey-dark">
                  <div>
                    <div className="count">
                      {item.count}{" "}
                      <span
                        className="text-small text-red"
                        style={{ fontSize: "18px" }}
                      >
                        (0)
                      </span>
                    </div>
                    <span className="group text-metal">{item.name}</span>
                  </div>
                </Menu.Item>
              );
            })}
          </Menu>
        ) : (
          <div className="text-center" />
        )}
      </div>
    );
  }
}

export default WorkflowFilterTop;
