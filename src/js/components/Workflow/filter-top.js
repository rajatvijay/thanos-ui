import React, { Component } from "react";
import { Icon, Divider } from "antd";
import { connect } from "react-redux";
import { workflowFiltersActions, workflowKindActions } from "../../actions";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";

class WorkflowFilterTop extends Component {
  state = {
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

    let tag = this.props.workflowFilters.kind.meta.tag;
    this.props.dispatch(workflowKindActions.getCount(tag));
  };

  render() {
    let that = this;
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;

    return (
      <div className="filter-top">
        {!loading ? (
          _.isEmpty(stepgroupdef_counts) ? (
            <div className="text-center text-grey">Empty workflow def</div>
          ) : (
            <Scrollbars style={{ width: "100%" }} autoHeight>
              <div>
                <ul className="filter-top-list--disabel filter-top-horizontal ant-menu ant-menu-light ant-menu-root ant-menu-horizontal">
                  {_.map(stepgroupdef_counts, function(item, index) {
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
                          <i className="material-icons text-metal">
                            {item.icon ? item.icon : "panorama_fish_eye"}
                          </i>
                          <br />
                          <span
                            className="group text-metal "
                            style={{ display: "inlineBlock" }}
                          >
                            {item.name}&nbsp;
                          </span>
                          <Divider
                            style={{ marginTop: "8px", marginBottom: "8px" }}
                          />
                          <div className="">
                            <span className="" style={{ fontSize: "16px" }}>
                              {item.count}{" "}
                            </span>
                            <span
                              className=" text-red overdue"
                              style={{ fontSize: "16px" }}
                              title="overdue"
                            >
                              {item.overdue_count !== 0
                                ? "(" + item.overdue_count + ")"
                                : ""}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Scrollbars>
          )
        ) : (
          <div className="text-center">
            <Icon type="loading" loading />{" "}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { workflowKind, workflowGroupCount, workflowFilters } = state;
  return {
    workflowKind,
    workflowGroupCount,
    workflowFilters
  };
}

export default connect(mapStateToProps)(WorkflowFilterTop);
