import React, { Component } from "react";
import { Layout, Select, Dropdown, Icon } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import { workflowFiltersActions, workflowKindActions } from "../../../actions";
import { connect } from "react-redux";
import { css } from "emotion";
import styled from "@emotion/styled";
import _ from "lodash";
import { taskQueueCount } from "../sidebarActions";

const { Sider } = Layout;

const SUB_MENU = ["TPI", "Donation Reciept", "BP", "All Other"];

const FiltersHeading = styled.div`
  height: 40;
  color: white;
  width: 100%;
  fontsize: 16;
  padding: 8px 28px;
  cursor: pointer;
  &:hover {
    background-color: #104775;
  }
`;
const SubMenuHeading = styled.div`
  height: 30px;
  color: rgb(255, 255, 255, 0.5);
  width: 100%;
  padding: 7px 30px 4px 45px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #158bd6;
  }
`;

class Sidebar extends Component {
  state = {
    activeFilter: [],
    selectedSubHeading: null
    // parent: null,
    // collapse: true
  };

  componentDidMount() {
    this.props.taskQueueCount();
  }

  setFilter = () => {
    const payload = {
      filterType: "alert_category",
      filterValue: this.state.activeFilter
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentWillUpdate(nextProps) {
    if (
      nextProps.workflowKind.workflowKind !==
      this.props.workflowKind.workflowKind
    ) {
      const metaValue =
        nextProps.workflowKind.workflowKind &&
        nextProps.workflowKind.workflowKind[0];
      if (metaValue) {
        this.props.dispatch(workflowKindActions.setValue(metaValue));
        this.setState({ value: metaValue.id });
      }
    }
  }

  handleClick = value => {
    console.log(value);
    // const id = parseInt(value, 10);
    // const that = this;
    // const metaValue = _.find(this.props.workflowKind.workflowKind, item => {
    //   return item.id === id;
    // });

    // this.setState({ value: id });
    // const payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    // this.props.dispatch(workflowFiltersActions.setFilters(payload));
    // this.props.dispatch(workflowKindActions.setValue(metaValue));
    // that.fetchGroupData(metaValue.tag);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
    this.props.dispatch(workflowKindActions.getStatusCount(tag));
  };

  renderDropdownList = selectedKind => {
    const { selectedSubHeading } = this.state;
    const { workflowKind } = this.props.workflowKind;
    if (workflowKind) {
      return (
        <div
          onClick={this.handleClick}
          className={css`
            position: fixed;

            width: 300px;
            background-color: #0a3150;
            max-height: 210px;
            overflow: auto;

            .ant-dropdown-menu-item > div {
              color: rgba(255, 255, 255, 0.5);
            }

            .ant-dropdown-menu-item-active {
              background-color: #104775;
            }

            .ant-dropdown-menu-item-active > div {
              color: white !important;
            }

            .ant-dropdown,
            .ant-dropdown-menu-item {
              padding: 10px 18px;
            }
          `}
        >
          {workflowKind.map(function(item) {
            return (
              <>
                <div
                  style={{
                    border: "none",
                    color: "white",
                    fontSize: 16
                  }}
                  key={`${item.id}`}
                >
                  <FiltersHeading
                    className={`${
                      selectedKind && selectedKind.name === item.name
                        ? "ant-dropdown-menu-item-active"
                        : null
                    }`}
                  >
                    {item.name}
                  </FiltersHeading>
                  {SUB_MENU.map(menu => {
                    return (
                      <SubMenuHeading>
                        {selectedSubHeading === menu ? (
                          <div>dadadsds</div>
                        ) : (
                          menu
                        )}
                      </SubMenuHeading>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
      );
    }
  };

  onSelectAlert = value => {
    if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.tag] }, function() {
        this.setFilter();
      });
    }
  };

  onSelectTask = value => {
    const payload = {
      filterType: "stepgroupdef",
      filterValue: value ? [value.id] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  onSelectMyTask = tag => {
    const payload = {
      filterType: "user-step-tag",
      filterValue: tag ? [tag] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  get isMyTaskSelected() {
    return (
      this.props.workflowFilters["user-step-tag"] &&
      this.props.workflowFilters["user-step-tag"].filterValue &&
      this.props.workflowFilters["user-step-tag"].filterValue.length &&
      this.props.workflowFilters["user-step-tag"].filterValue.includes(
        "Assignee"
      )
    );
  }

  render() {
    const { isError } = this.props.workflowAlertGroupCount;
    const selectedKind =
      this.state.value &&
      _.find(this.props.workflowKind.workflowKind, item => {
        return item.id === this.state.value;
      });

    return (
      <Sider
        width={300}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#104774"
        }}
      >
        <div
          className={css`
            width: 300px;
            padding-bottom: 100px;
            height: 100%;
            fontfamily: Cabin;
            minheight: 110vh;
            background: #104775;
          `}
        >
          <div className="logo" />
          <Dropdown
            trigger={["click"]}
            className={css`
              background-color: #0a3150;
              height: 65px;
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding: 0px 28px;
              font-size: 17px;
              color: white;
              align-items: center;
              cursor: pointer;
            `}
            overlay={this.renderDropdownList(selectedKind)}
          >
            <div>
              {selectedKind ? (
                <>
                  {selectedKind.name} <Icon type="down" />
                </>
              ) : (
                ""
              )}
            </div>
          </Dropdown>
          {/* <Select
            dropdownStyle={{ position: "fixed" }}
            className={css`
              .ant-select-selection {
                background-color: #0a3150;
                border: none;
                height: 65px;
                color: white;
                font-size: 18px;
                padding-left: 10px;
              }
              .ant-select-selection-selected-value {
                line-height: 65px;
              }
              .ant-select-arrow {
                color: white;
                margin-right: 10px;
              }
            `}
            dropdownClassName="kind-select"
            value={selectedKind && selectedKind.name}
            style={{ width: "100%", display: "block" }}
            onChange={this.handleChange}
          >
            {this.renderDropdownList()}
          </Select> */}

          <div
            style={{
              backgroundColor: "#104774",
              padding: "5px 0px",
              maxHeight: "80vh",
              overflowY: "scroll"
            }}
            className={css`
              .sidebarList:hover {
                opacity: 0.4;
              }
            `}
          >
            <div>
              <TaskQueueList
                count={this.props.count}
                taskQueues={this.props.workflowGroupCount.stepgroupdef_counts}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectTask={this.onSelectTask}
                onSelectMyTask={this.onSelectMyTask}
                isMyTaskSelected={this.isMyTaskSelected}
              />
            </div>

            <div style={{ display: isError ? "none" : "block" }}>
              <AlertList
                alerts={this.props.workflowAlertGroupCount.alert_details}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectAlert={this.onSelectAlert}
              />
            </div>
          </div>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu,
    taskQueueCount
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu,
    count: taskQueueCount.count
  };
}

export default connect(
  mapStateToProps,
  { taskQueueCount }
)(Sidebar);
