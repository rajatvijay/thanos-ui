import React, { Component } from "react";
import { baseUrl, authHeader } from "../../_helpers";
import { Select, Spin, Layout, Icon, Tooltip, Menu } from "antd";
import debounce from "lodash.debounce";
import { connect } from "react-redux";
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
    //countData: null,
    activeFilter: []
  };

  handleClick = value => {
    if (this.state.activeFilter[0] === value.id) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.id] }, function() {
        this.setFilter();
      });
    }
  };

  setFilter = () => {
    let payload = {
      filterType: "stepgroupdef",
      filterValue: this.state.activeFilter
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentDidMount = () => {
    //this.fetchCountData();
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.tag !== nextProps.tag) {
      console.log("resloaaaaaaadddddd");
      this.fetchCountData();
    }
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

  render() {
    let that = this;
    const { fetching, data } = this.state;

    return (
      <div className="filter-top">
        {!fetching ? (
          <div>
            <ul className="filter-top-list--disabel ant-menu ant-menu-light ant-menu-root ant-menu-horizontal">
              {_.map(data.stepgroupdef_counts, function(item, index) {
                return (
                  <li
                    key={item.id}
                    className={
                      "filter-top-list-item--disable ant-menu-item text-grey-dark " +
                      (that.state.activeFilter[0] === item.id
                        ? "ant-menu-item-selected"
                        : "")
                    }
                    onClick={that.handleClick.bind(that, item)}
                  >
                    <div>
                      <div className="count">
                        {item.count}{" "}
                        <span
                          className="text-small text-red overdue"
                          style={{ fontSize: "18px" }}
                        >
                          (0)
                        </span>
                      </div>

                      <span className="group text-metal">{item.name}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-center" />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { workflowKind, workflowGroupCount } = state;
  return {
    workflowKind,
    workflowGroupCount
  };
}

export default connect(mapStateToProps)(WorkflowFilterTop);
