import React, { Component } from "react";
import { Icon, Tag } from "antd";
import { connect } from "react-redux";
import { workflowFiltersActions, workflowKindActions } from "../../actions";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";

class AlertFilter extends Component {
  state = {
    activeFilter: []
  };

  handleClick = (value, e) => {
    console.log(value, e);

    e.preventDefault();

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

  render() {
    let that = this;
    const { alert_details, loading } = this.props.workflowGroupCount;
    //const { loading } = this.props.workflowGroupCount;

    // let alert_details = [
    //     {
    //       "sub_categories": [
    //         {
    //           "id": 5,
    //           "name": "20 days reminder",
    //           "help_text": "asdsdaadsdsaads",
    //           "tag": "20-days-reminder",
    //           "count": 0
    //         }
    //       ],
    //       "id": 4,
    //       "name": "intimation before date",
    //       "help_text": "asfdssfdsfsfddf",
    //       "tag": "intimation",
    //       "count": 0
    //     },
    //     {
    //       "sub_categories": [
    //         {
    //           "id": 1,
    //           "name": "90 days expiry",
    //           "help_text": "some help text",
    //           "tag": "90-days-expiry",
    //           "count": 0
    //         },
    //         {
    //           "id": 2,
    //           "name": "60 days expiry",
    //           "help_text": "sdahsdgdshbk",
    //           "tag": "60-days-expiry",
    //           "count": 0
    //         }
    //       ],
    //       "id": 3,
    //       "name": "expiration",
    //       "help_text": "fafdsfdfsdfdffdsfsdfdsfd",
    //       "tag": "expiration-01",
    //       "count": 0
    //     }
    //   ];

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
                      //opacity:0,
                      //visibility:'hidden',
                      //borderRadius: "3px"
                    }}
                  />
                )}
              >
                <div>
                  <div className="filter-top-list alert-tag-list">
                    {_.map(alert_details, function(item, index) {
                      return (
                        <Tag
                          key={item.id}
                          className={
                            "alert-tag-item  " +
                            (that.state.activeFilter[0] === item.tag
                              ? "alert-tag-item-active "
                              : " ") +
                            (item.color_label ? " " : "alert-primary ")
                          }
                          closable={
                            that.state.activeFilter[0] === item.tag
                              ? true
                              : false
                          }
                          onClose={that.handleClick.bind(that, item)}
                          color={item.color_label ? item.color_label : null}
                          onClick={that.handleClick.bind(that, item)}
                        >
                          {item.name} ({item.count})
                        </Tag>
                      );
                    })}
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
