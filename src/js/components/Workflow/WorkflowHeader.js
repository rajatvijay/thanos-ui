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
import { changeStatusActions, workflowActions } from "../../actions";
import { FormattedMessage } from "react-intl";
import AuditListTabs from "../Navbar/audit_log";
import WorkflowPDFModal from "./WorkflowPDFModal";
import { ProcessLcData } from "./ProcessLcData";
import { goToPrevStep } from "../../utils/customBackButton";
import { css } from "emotion";

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

      <Col span={4}>
        <HeaderLcData {...props} />
      </Col>

      <Col span={6}>
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

      <Col span={4}>
        <HeaderOptions {...props} />
      </Col>
    </Row>
  );

  return (
    <Row
      style={{ cursor: "pointer" }}
      onClick={() => props.showModal(props.workflow.id)}
      type="flex"
      align="middle"
    >
      <Col span={props.isExpanded ? 22 : 24}>{headerData}</Col>

      {/* {props.isExpanded ? (
        <Col span={2} className="details-link-wrapper ">
          {/* <span
          //onClick={()=>props.showModal(props.workflow.id)}
            className="details-link slide-this"
           //to={"/workflows/instances/" + props.workflow.id + "/"}
            title="Show details"
            style={{
              width: "75px",
              float: "right",
              //pointer:"cursor"
            }}
          >
            <i className="material-icons">arrow_forward</i>
          </span> */}
      {/* </Col> */}
      {/* // ) : null} */}
    </Row>
  );
};

const createFamilyListForBreadcrums = family => {
  return family.map(item => (
    <React.Fragment>
      <Link style={{ color: "black" }} to={"/workflows/instances/" + item.id}>
        {" "}
        {item.name}
      </Link>
      <span> /</span>
    </React.Fragment>
  ));
};

const HeaderTitle = props => {
  const { workflow } = props;
  const { family } = workflow;

  if (family.length === 1) {
    return (
      <div>
        <span
          title={props.workflow.name}
          style={{
            color: "#000000",
            fontSize: "20px",
            letterSpacing: "-0.04px",
            lineHeight: "24px"
          }}
        >
          {workflow.name}
        </span>
      </div>
    );
  } else if (family.length === 2) {
    return (
      <div>
        <span
          title={props.workflow.name}
          style={{
            color: "#000000",
            fontSize: "20px",
            letterSpacing: "-0.04px",
            lineHeight: "24px"
          }}
        >
          <Link
            className={css`
              color: #b5b5b5;
              &:hover {
                color: black;
              }
            `}
            to={"/workflows/instances/" + family[0].id}
          >
            {family[0].name}
          </Link>{" "}
          / {family[1].name}
        </span>
      </div>
    );
  } else {
    return (
      <div>
        <Popover content={createFamilyListForBreadcrums(family)}>
          <span
            title={props.workflow.name}
            style={{
              color: "#000000",
              fontSize: "16px",
              letterSpacing: "-0.04px",
              lineHeight: "24px"
            }}
          >
            <Link
              className={css`
                color: #b5b5b5;
                &:hover {
                  color: black;
                }
              `}
              to={"/workflows/instances/" + family[0].id}
            >
              {family[0].name}
            </Link>
            <span style={{ color: "#b5b5b5" }}> /... / </span>
            {workflow.name}
          </span>
        </Popover>
      </div>
    );
  }
};

export const HeaderLcData = props => {
  let subtext = _.filter(props.workflow.lc_data, item => {
    return item.display_type == "normal";
  });
  return (
    <div
      style={{
        color: "#000000",
        fontSize: "13px",
        letterSpacing: "-0.03px",
        lineHeight: "16px",
        opacity: 0.3
      }}
    >
      {_.size(subtext) >= 2 ? (
        <Tooltip title={subtext[1].label + ": " + (subtext[1].value || "-")}>
          <span className="t-cap">
            {subtext[1].show_label ? subtext[1].label + ": " : ""}
          </span>
          {ProcessLcData(subtext[1])}
        </Tooltip>
      ) : (
        ""
      )}
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

  progress = Math.trunc((stepCompleted / allSteps) * 100);
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
        <div className="pd-left status-text text-black t-12 text-right">
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

export class GetMergedData extends React.Component {
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
            className={" ellip-small text-middle "}
            style={{ maxWidth: "100%" }}
          >
            <span className="t-cap">
              {item.show_label || (is_alert && item.link) ? item.label : ""}
              {item.link ? "" : item.show_label ? ": " : ""}
            </span>
            {ProcessLcData(item) || ""}
          </span>

          {/* {item.color ? (
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
          ) : null} */}
        </span>
      );

      let tagWrapper = null;

      if (item.link) {
        tagWrapper = (
          <Link
            to={item.link}
            className={classes}
            style={
              is_alert
                ? {
                    background: item.color,
                    color: "#fff"
                  }
                : {}
            }
          >
            {tagLabel}
          </Link>
        );
      } else {
        tagWrapper = (
          <span
            className={classes}
            style={
              is_alert
                ? {
                    background: item.color,
                    color: "#fff"
                  }
                : {}
            }
          >
            {tagLabel}
          </span>
        );
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
