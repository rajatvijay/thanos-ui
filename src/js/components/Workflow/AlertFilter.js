import React, { Component } from "react";
import { Icon, Tag, Divider } from "antd";
import { connect } from "react-redux";
import { workflowFiltersActions, workflowKindActions } from "../../actions";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";

class AlertFilter extends Component {
  state = {
    activeFilter: [],
    parent: null
  };

  handleClick = (value, e) => {
    e.preventDefault();

    if (value.sub_categories) {
      this.setState({ parent: value });
    } else if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.tag] }, function() {
        this.setFilter();
      });
    }
  };

  onClose = value => {
    if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    }

    //this.setState({parent:null});
  };

  setFilter = () => {
    let payload = {
      filterType: "alert_category",
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

  clearFilter = () => {
    this.setState({ parent: null });
  };

  getTags = list => {
    let that = this;
    const { parent, activeFilter } = this.state;

    //const collapseButton = <i className="material-icons text-dark t-14 pd-left-sm" style={{position:"relative",top:"3px", right:"-5px",zIndex:1}} onClick={this.clearFilter}>cancel</i>

    let tagsList = _.map(list, function(item, index) {
      const closableButton = (
        <i
          className="material-icons text-dark t-14 pd-left-sm"
          style={{ position: "relative", top: "3px", right: "-5px", zIndex: 1 }}
          onClick={that.onClose.bind(that, item)}
        >
          cancel
        </i>
      );

      let closable = false;
      if (activeFilter[0] === item.tag) {
        closable = true;
      }

      return (
        <Tag
          key={item.id}
          className={
            "alert-tag-item  " +
            (activeFilter[0] === item.tag ? "alert-tag-item-active " : " ") +
            (item.color_label ? " " : "alert-primary ")
          }
          color={item.color_label || null}
          onClick={that.handleClick.bind(that, item)}
        >
          {item.name} ({item.count})
          {closable ? closableButton : null}
        </Tag>
      );
    });

    return tagsList;
  };

  render() {
    let that = this;
    const { alert_details, loading } = this.props.workflowGroupCount;
    const { parent } = this.state;

    return (
      <div>
        {!loading ? (
          _.isEmpty(alert_details) ? (
            <div />
          ) : (
            <div className="filter-top">
              <Scrollbars
                style={{ width: "100%", height: "30px" }}
                autoHide
                renderTrackHorizontal={({ style, ...props }) => (
                  <div
                    {...props}
                    style={{
                      ...style,
                      height: "1px",
                      right: "2px",
                      bottom: "2px",
                      left: "2px"
                    }}
                  />
                )}
              >
                <div>
                  <div className="filter-top-list alert-tag-list">
                    {_.size(parent) ? (
                      <span>
                        <i
                          onClick={this.clearFilter}
                          className="material-icons t-16 text-anchor text-middle pd-right-sm"
                        >
                          arrow_back
                        </i>
                        {this.getTags([parent])}
                        <Divider type="vertical" />
                      </span>
                    ) : null}

                    {_.size(parent)
                      ? this.getTags(parent.sub_categories)
                      : this.getTags(alert_details)}
                  </div>
                </div>
              </Scrollbars>
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

function mapStateToProps(state) {
  const { workflowKind, workflowGroupCount, workflowFilters } = state;
  return {
    workflowKind,
    workflowGroupCount,
    workflowFilters
  };
}

export default connect(mapStateToProps)(AlertFilter);
