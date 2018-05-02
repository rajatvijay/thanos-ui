import React, { Component } from "react";
import { Select, Spin, Layout, Icon, Tooltip, Menu } from "antd";
import debounce from "lodash.debounce";
import _ from "lodash";

//const filter = {};

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { Sider } = Layout;
const Option = Select.Option;

const filterTypeTop = [
  { id: 1, name: "BuyerOps", total: 30, current: 5 },
  { id: 2, name: "Supplier", total: 22, current: 4 },
  { id: 3, name: "Vet", total: 41, current: 5 },
  { id: 4, name: "Supplier Pending", total: 20, current: 0 },
  { id: 5, name: "Infosec", total: 12, current: 2 },
  { id: 5, name: "Compliance review", total: 1, current: 1 },
  { id: 5, name: "Confirm", total: 3, current: 0 },
  { id: 5, name: "Errors", total: 6, current: 5 }
];

const filterTypeTopSubstep = [
  {
    id: 1,
    steps: [{ id: 1, name: "Initiate", total: 30, current: 5 }]
  },

  {
    id: 2,
    steps: [
      { id: 1, name: "Basic information", total: 8, current: 1 },
      { id: 2, name: "Tax ID check", total: 5, current: 0 },
      { id: 3, name: "Billing information", total: 1, current: 1 },
      { id: 4, name: "Ordering information", total: 4, current: 2 },
      { id: 5, name: "Banking information", total: 2, current: 0 }
    ]
  },
  {
    id: 3,
    steps: [{ id: 1, name: "Setup", total: 41, current: 5 }]
  },
  {
    id: 4,
    steps: [
      { id: 1, name: "Country risk level", total: 4, current: 0 },
      { id: 2, name: "D&B select company", total: 5, current: 0 },
      { id: 3, name: "Prohibited", total: 11, current: 0 }
    ]
  },
  {
    id: 5,
    steps: [
      { id: 1, name: "Misc GFA", total: 9, current: 1 },
      { id: 2, name: "Review", total: 3, current: 1 }
    ]
  }
];

class WorkflowFilterTop extends Component {
  constructor(props) {
    super(props);
    // this.lastFetchId = 0;
    // this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
    selectedFilter: null,
    subFilterList: null
  };

  // fetchUser = value => {
  //   console.log("fetching user", value);
  //   this.lastFetchId += 1;
  //   const fetchId = this.lastFetchId;
  //   this.setState({ data: [], fetching: true });
  //   fetch("https://randomuser.me/api/?results=5")
  //     .then(response => response.json())
  //     .then(body => {
  //       if (fetchId !== this.lastFetchId) {
  //         // for fetch callback order
  //         return;
  //       }
  //       const data = body.results.map(user => ({
  //         text: `${user.name.first} ${user.name.last}`,
  //         value: user.login.username
  //       }));
  //       this.setState({ data, fetching: false });
  //     });
  // };

  // handleChange = value => {
  //   this.setState({
  //     value,
  //     data: [],
  //     fetching: false
  //   });
  // };

  onFilterSelect = (item, l) => {
    var filt = _.filter(filterTypeTopSubstep, function(s) {
      return s.id === item;
    });

    if (this.state.selectedFilter === item) {
      this.setState({ selectedFilter: null, subFilterList: null });
    } else {
      this.setState({ selectedFilter: item, subFilterList: filt });
      console.log(this.state.subFilterList);
    }
  };

  setitem(item) {
    console.log(item);
  }

  render() {
    let that = this;
    const { fetching, data, value } = this.state;

    return (
      <div className="filter-top">
        {/*<div className="filter-wrapper">
                  <ul className="filter-top-list">
                    {_.map(filterTypeTop, function(item, index) {
                      return (
                        <li
                          className={
                            "filter-top-list-item " +
                            (that.state.selectedFilter === item.id ? "active" : null)
                          }
                          key={"filter-top-" + index}
                          id={"filter-" + index}
                          onClick={that.onFilterSelect.bind(this, item.id)}
                        >
                          <div>{item.name}</div>
                          <span>
                            {item.total}{" "}
                            <span className="text-red">({item.current})</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {this.state.subFilterList ? (
                    <ul className="filter-top-list filter-top-secondary ">
                      {_.map(this.state.subFilterList[0].steps, function(item, index) {
                        console.log(item);
                        return (
                          <li
                            className="filter-top-list-item"
                            key={"filter-top-" + index}
                            id={"filter-" + index}
                          >
                            <div>{item.name}</div>
                            <span>
                              {item.total}{" "}
                              <span className="text-red">({item.current})</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>*/}

        {/*<Select
            mode="multiple"
            labelInValue
            value={value}
            placeholder={this.props.placeholder}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={this.fetchUser}
            onChange={this.handleChange}
            style={{ width: "100%" }}
          >
            {data.map(d => <Option key={d.value}>{d.text}</Option>)}
          </Select>*/}

        <Menu
          onClick={this.handleClick}
          //selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          {_.map(filterTypeTop, function(item, index) {
            return (
              <Menu.Item key={"key-" + index} className="text-grey-dark">
                {item.name} ({item.total})
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default WorkflowFilterTop;
