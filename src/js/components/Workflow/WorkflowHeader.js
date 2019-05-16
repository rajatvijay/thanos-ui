import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import _ from "lodash";
import {
  Badge,
  Icon,
  Progress,
  Dropdown,
  Menu,
  Row,
  Col,
  Tooltip,
  Tag,
  Popover,
  Drawer
} from "antd";
import { calculatedData } from "./calculated-data";
import { history } from "../../_helpers";
import { changeStatusActions } from "../../actions";
import { FormattedMessage } from "react-intl";
import AuditListTabs from "../Navbar/audit_log";
import WorkflowPDFModal from "./WorkflowPDFModal";
import { ProcessLcData } from "./ProcessLcData";
import { goToPrevStep } from "../../utils/customBackButton";

const { getProcessedData, getProgressData } = calculatedData;

// const getpercent = group => {
//   let total = group.steps.length;
//   let completed = 0;
//   _.map(group.steps, function(item) {
//     if (item.completed_at) {
//       completed += 1;
//     }
//   });

//   return Math.trunc(completed / total * 100);
// };

//////////////////
/*workflow Head*/
/////////////////

// title --- lc data + alerts ---- status --- rank --- go to details //
export const WorkflowHeader = props => {
  let headerData = (
    <Row type="flex" align="middle" className="lc-card-head">
      <Col span={9} className="text-left ">
        <HeaderTitle {...props} />
      </Col>

      <Col span={8}>
        <GetMergedData {...props} />
      </Col>

      <Col span={1} className="text-center">
        {props.workflow.sorting_primary_field && props.sortingEnabled ? (
          <span
            className={
              "risk-item bg-" +
              getScoreColor(props.workflow.sorting_primary_field)
            }
          >
            {props.rank}
          </span>
        ) : null}
      </Col>

      <Col span={6}>
        <HeaderOptions {...props} />
      </Col>
    </Row>
  );

  return (
    <Row type="flex" align="middle">
      <Col span={props.isExpanded ? 22 : 24}>{headerData}</Col>

      {props.isExpanded ? (
        <Col span={2} className="details-link-wrapper ">
          <Link
            className="details-link slide-this"
            to={"/workflows/instances/" + props.workflow.id + "/"}
            title="Show details"
          >
            <i className="material-icons">arrow_forward</i>
          </Link>
        </Col>
      ) : null}
    </Row>
  );
};

const HeaderTitle = props => {
  return (
    <div>
      <span
        className=" text-base  company-name text-ellipsis"
        title={props.workflow.name}
      >
        {props.workflow.name}
      </span>
    </div>
  );
};

const getGroupProgress = group => {
  let progress = 0;
  let allSteps = group.steps.length;
  let stepCompleted = 0;

  _.map(group.steps, function(step) {
    if (step.completed_at !== null) {
      stepCompleted += 1;
    }
  });

  progress = Math.trunc(stepCompleted / allSteps * 100);
  return progress;
};

// const getAllProgress = group => {
//   let progress = 0;
//   let allSteps = group.steps.length;
//   let stepCompleted = 0;

//   _.map(group.steps, function(step) {
//     if (step.completed_at !== null) {
//       stepCompleted += 1;
//     }
//   });

//   progress = Math.trunc(stepCompleted / allSteps * 100);
//   return progress;
// };

class HeaderOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.workflow.status.label,
      showSidebar: false,
      isWorkflowPDFModalVisible: false
    };
  }

  onStatusChange = key => {
    let id = parseInt(key.key, 10);
    let selected = {};
    _.map(this.props.statusType, function(i) {
      if (i.id === id) {
        selected = i;
      }
    });

    this.setState({ current: selected.label });

    let payload = {
      workflowId: this.props.workflow.id,
      statusId: id
    };

    this.props.dispatch(changeStatusActions(payload));
  };

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  openCommentSidebar = () => {
    let object_id = this.props.workflow.id;
    this.props.getCommentSidebar(object_id, "all_data");
  };

  printDiv = () => {
    var that = this;
    this.setState({ printing: true });

    setTimeout(function() {
      var printContents = document.getElementById("StepBody").innerHTML;
      var docHead = document.querySelector("head").innerHTML;

      var body =
        "<!DOCTYPE html><html><head>" +
        "<title>" +
        //that.props.currentStepFields.currentStepFields.definition.name +
        "</title>" +
        docHead +
        "</head><body>" +
        printContents +
        "</body></html>";
      var myWindow = window.open();
      myWindow.document.write(body);
      myWindow.document.close();
      myWindow.focus();

      setTimeout(function() {
        myWindow.print();
        myWindow.close();
      }, 1000);
      that.setState({ printing: false });
    }, 500);
  };

  getComment = object_id => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.addComment(object_id, "workflow");
  };

  toggleWorkflowPDFModal = () => {
    this.setState(state => ({
      isWorkflowPDFModalVisible: !state.isWorkflowPDFModalVisible
    }));
  };

  onCommentHover = () => {
    this.props.disableCollapse();
  };

  onCommentHoverOut = () => {
    this.props.enableCollapse();
  };

  render = () => {
    const props = this.props;
    const filteredStatus = _.filter(props.statusType, function(o) {
      if (o.workflow_kind === props.workflow.definition.kind) {
        return o;
      }
    });

    const menu = (
      <Menu onClick={this.onStatusChange}>
        {props.statusType
          ? _.map(filteredStatus, function(status) {
              return (
                <Menu.Item
                  key={status.id}
                  disabled={
                    status.label === props.workflow.status.label ? true : false
                  }
                >
                  {status.label}
                </Menu.Item>
              );
            })
          : null}
      </Menu>
    );

    let selected_flag = null;
    if (_.size(props.workflow.selected_flag)) {
      selected_flag = props.workflow.selected_flag[props.workflow.id];
    }
    let that = this;
    const { workflow } = this.props;

    let status = (
      <Tooltip title={this.state.current}>
        <div className="pd-left pd-right status-text text-light t-12 ">
          {this.state.current}
        </div>
      </Tooltip>
    );

    return (
      <Row>
        <Col span={20}>{status}</Col>
        <Col span={4} className="text-right">
          {props.showCommentIcon &&
          props.isEmbedded &&
          workflow.comments_allowed ? (
            <span>
              <div
                className="add_comment_btn"
                onMouseOver={this.onCommentHover}
                onMouseOut={this.onCommentHoverOut}
              >
                <span>
                  <i
                    className="material-icons  t-18 text-metal"
                    onClick={that.getComment.bind(that, props.workflow.id)}
                  >
                    chat_bubble_outline
                  </i>
                </span>
              </div>
            </span>
          ) : null}

          {selected_flag && props.isEmbedded ? (
            <Tooltip title={selected_flag.flag_detail.label}>
              <span style={{ marginTop: "3px" }}>
                <i
                  style={{
                    color: selected_flag.flag_detail.extra.color,
                    width: "14px"
                  }}
                  className="material-icons  t-12 "
                >
                  fiber_manual_records
                </i>
              </span>
            </Tooltip>
          ) : null}
        </Col>
      </Row>
    );
  };
}

const getIcon = (id, kinds) => {
  let returnKind = _.filter(kinds.workflowKind, ["id", id]);
  let icon = _.size(returnKind) ? returnKind[0].icon : null;

  if (icon) {
    return icon;
  } else {
    return "folder_open";
  }
};

const CheckData = props => {
  if (moment(props.data, moment.ISO_8601).isValid()) {
    return <Moment format="MM/DD/YYYY">{props.data}</Moment>;
  } else {
    return props.data;
  }
};

class GetMergedData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    let props = this.props;

    // if (!props.field) {
    //   return <span />;
    // }

    let data = this.props.workflow.lc_data;

    let alert_data = _.map(this.props.workflow.alerts, function(alert) {
      let alertReduced = {
        display_type: "alert",
        label: alert.alert.category.name,
        link:
          "/workflows/instances/" +
          alert.workflow +
          "/" +
          "?group=" +
          alert.step_group +
          "&step=" +
          alert.step,
        color: alert.alert.category.color_label
      };
      return alertReduced;
    });

    _.forEach(data, function(v) {
      if (v.display_type == "alert" && v.value) {
        alert_data.push(v);
      }
    });

    let lc_data = _.filter(data, function(v) {
      return v.display_type == "normal";
    });

    let lc_data_filtered = _.filter(lc_data, function(v, index) {
      return v.value && index > 1;
    });

    let that = this;
    let styling = props.fieldExtra ? props.fieldExtra.lc_data_colorcodes : {};

    const expander = data => {
      let count = 2;
      if (_.size(data) > count) {
        return (
          <span
            className="text-anchor text-middle text-right text-light t-12"
            onClick={this.toggleExpand}
          >
            {this.state.expanded ? "-" : "+"}
            {_.size(data) - count}
          </span>
        );
      } else {
        return;
      }
    };

    const TagItem = (item, index, is_alert) => {
      let classes = "  t-12 text-middle text-light ";
      if (is_alert) {
        classes += " ant-tag v-tag pd-right";
      } else {
        classes += " pd-right-lg";
      }

      //let tagLabel = <span className={classes}>
      let tagLabel = (
        <span>
          <span
            className={
              is_alert ? " ellip-small s50 " : " ellip-small s100 text-middle "
            }
          >
            <span className="t-cap">
              {item.show_label || (is_alert && item.link) ? item.label : ""}
              {item.link ? "" : item.show_label ? ": " : ""}
            </span>
            {ProcessLcData(item) || ""}
          </span>

          {item.color ? (
            <i
              style={{ color: item.color }}
              className="material-icons  t-12 tag-dot"
            >
              fiber_manual_records
            </i>
          ) : styling && styling[item.label] ? (
            <i
              style={{ color: styling[item.label].color }}
              className="material-icons t-12 tag-dot"
            >
              fiber_manual_records
            </i>
          ) : null}
        </span>
      );

      let tagWrapper = null;

      if (item.link) {
        tagWrapper = (
          <Link to={item.link} className={classes}>
            {tagLabel}
          </Link>
        );
      } else {
        tagWrapper = <span className={classes}>{tagLabel}</span>;
      }

      return (
        <Tooltip key={index} title={item.label + ": " + (item.value || "")}>
          {tagWrapper}
        </Tooltip>
      );
    };

    return (
      <div className="group-overviewl">
        <div className="overflow-wrapper">
          <div className="step-ui">
            <Row type="flex" align="middle">
              <Col span={22}>
                {_.size(alert_data)
                  ? _.map(alert_data, function(item, index) {
                      let count = index + 1;
                      if (count < 3) {
                        return TagItem(item, index, true);
                      } else if (that.state.expanded) {
                        return TagItem(item, index, true);
                      }
                    })
                  : _.map(lc_data_filtered, function(item, index) {
                      let count = index + 1;
                      if (count < 2) {
                        return TagItem(item, index, false);
                      }
                    })}
              </Col>
              <Col span={2}>{expander(alert_data)}</Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const getScoreColor = riskValue => {
  let value = parseInt(riskValue, 10);
  if (value >= 7) {
    return "green";
  } else if (value >= 4 && value <= 6) {
    return "yellow";
  } else if (value <= 3) {
    return "red";
  } else {
    return "light";
  }
};

const GetAlertData = props => {
  return (
    <div className="group-overview">
      <div className="overflow-wrapper">
        <div className="filter-top-list alert-tag-list">
          {_.map(props.workflow.alerts, function(item, index) {
            let more = props.workflow.alerts - 3;

            if (index >= 3) {
              if (index === 4) {
                return <span className="text-light">+{more}</span>;
              } else {
                return;
              }
            } else {
              return (
                <Tag
                  key={item.alert.id}
                  className={
                    "alert-tag-item " + item.alert.category.color_label ||
                    "alert-primary"
                  }
                  color={item.alert.category.color_label || null}
                >
                  <Link
                    to={
                      "/workflows/instances/" +
                      item.workflow +
                      "/" +
                      "?group=" +
                      item.step_group +
                      "&step=" +
                      item.step
                    }
                  >
                    {item.alert.category.name}
                  </Link>
                </Tag>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
