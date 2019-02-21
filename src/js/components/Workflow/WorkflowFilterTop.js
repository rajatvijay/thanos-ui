import React, { Component } from "react";
import { Icon, Divider, Badge, Tag, Tooltip } from "antd";
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
    let tag = this.props.workflowFilters.kind.meta.tag;

    if (_.isEmpty(this.props.workflowGroupCount.stepgroupdef_counts)) {
      this.props.dispatch(workflowKindActions.getCount(tag));
      this.props.dispatch(workflowKindActions.getStatusCount(tag));
    }
  };

  componeneDidUpdate = prevProps => {
    let tag = this.props.workflowFilters.kind.meta.tag;

    if (this.props.workflowFilters.kind !== prevProps.workflowFilters.kind) {
      this.props.dispatch(workflowKindActions.getCount(tag));
      this.props.dispatch(workflowKindActions.getStatusCount(tag));
    }
  };

  render() {
    let that = this;
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;

    return (
      <div className="mr-top-sm">
        {!loading ? (
          _.isEmpty(stepgroupdef_counts) ? null : (
            <div>
              {_.map(stepgroupdef_counts, function(item, index) {
                return (
                  <Tag
                    key={item.id}
                    className={
                      " pd-bottom-sm t-12 v-tag alert-metal  " +
                      (that.state.activeFilter[0] === item.id
                        ? "text-bold alert-active"
                        : "")
                    }
                    onClick={that.handleClick.bind(that, item)}
                  >
                    <Tooltip title={"Overdue: " + item.overdue_count}>
                      <span className="ellip-small s50">{item.name} </span>
                      <span className="ellip-small s50">
                        ({item.count}){" "}
                        {item.overdue_count ? (
                          <Badge status="error" className="lc-tag-dot" />
                        ) : null}
                      </span>
                    </Tooltip>
                  </Tag>
                );
              })}
            </div>
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

export default WorkflowFilterTop;
