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

export const WorkflowHeader = props => {
  let progressData = props.workflow.progress;
  let subtext = _.filter(props.workflow.lc_data, item => {
    return item.display_type === "normal";
  });

  const goBack = () => {
    goToPrevStep();
  };

  return (
    <div className="ant-collapse-header">
      <Row type="flex" align="middle" className="lc-card-head">
        {props.isChild || props.isEmbedded ? null : (
          <Col span={1} className=" text-anchor">
            {props.detailsPage && !props.nextUrl.url ? (
              <span onClick={goBack} className="text-anchor pd-ard-sm ">
                <i
                  className="material-icons text-secondary"
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                >
                  keyboard_backspace
                </i>
              </span>
            ) : (
              <span className="pd-right">
                <Popover
                  content={
                    <div className="text-center">
                      <div className="small">{progressData}% completed</div>
                    </div>
                  }
                >
                  <Progress
                    type="circle"
                    percent={progressData}
                    width={35}
                    format={percent => (
                      <i
                        className="material-icons text-primary"
                        style={{ fontSize: "18px", verticalAlign: "middle" }}
                      >
                        {props.kind === ""
                          ? "folder_open"
                          : getIcon(props.workflow.definition.kind, props.kind)}
                      </i>
                    )}
                  />
                </Popover>
              </span>
            )}
          </Col>
        )}

        <HeaderTitle {...props} />

        <Col span={4} className="t-12 text-light pd-right-sm">
          <div className="text-ellipsis" style={{ paddingTop: "6px" }}>
            {_.size(subtext) >= 2 ? (
              <Tooltip
                title={subtext[1].label + ": " + (subtext[1].value || "-")}
              >
                <span className="t-cap">
                  {subtext[1].show_label ? subtext[1].label + ": " : ""}
                </span>
                {ProcessLcData(subtext[1])}
              </Tooltip>
            ) : (
              ""
            )}
          </div>
        </Col>

        <Col span={7}>
          <GetMergedData {...props} />
        </Col>

        <Col span={2} className="text-center">
          {/* props.workflow.sorting_primary_field &&  */}
          {props.workflow.sorting_primary_field && props.sortingEnabled ? (
            <Badge
              count={<span>{props.rank}</span>}
              style={{
                backgroundColor: getScoreColor(
                  props.workflow.sorting_primary_field
                )
              }}
            />
          ) : null}{" "}
        </Col>
        <HeaderOptions2 {...props} />
      </Row>
    </div>
  );
};

const HeaderTitle = props => {
  let progressData = getProgressData(props.workflow);
  let subtext = _.filter(props.workflow.lc_data, item => {
    return item.display_type == "normal";
  });

  return (
    <Col span={props.isChild ? 6 : 5} className="text-left ">
      <div>
        {props.isChild ? (
          <a
            href={"/workflows/instances/" + props.workflow.id + "/"}
            className="text-nounderline "
          >
            <span
              className=" text-base text-bold company-name text-ellipsis display-inline-block text-middle"
              title={props.workflow.name}
            >
              {props.workflow.name}
            </span>
          </a>
        ) : (
          <Link
            to={"/workflows/instances/" + props.workflow.id + "/"}
            className="text-nounderline "
          >
            <span
              className=" text-base company-name display-inline-block text-middle text-ellipsis "
              title={props.workflow.name}
            >
              {props.workflow.name}
            </span>
          </Link>
        )}

        <div className="lc1 text-ellipsis">
          {_.size(subtext) ? (
            <Tooltip
              title={subtext[0].label + ": " + (subtext[0].value || "-")}
            >
              <span className="t-cap">
                {subtext[0].show_label ? subtext[0].label + ": " : ""}
              </span>
              {ProcessLcData(subtext[0])}
            </Tooltip>
          ) : (
            ""
          )}
        </div>
      </div>
    </Col>
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

const getAllProgress = group => {
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

class HeaderOptions2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.workflow.status.label,
      showSidebar: false,
      isWorkflowPDFModalVisible: false
    };
  }

  componentDidMount = () => {};

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

    const workflowActionMenu = (
      <Menu>
        <Menu.Item key={"activity"} onClick={this.toggleSidebar}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              restore
            </i>{" "}
            <FormattedMessage id="workflowsInstances.viewActivityLog" />
          </span>
        </Menu.Item>

        <Menu.Item key={"message"} onClick={this.openCommentSidebar}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">
              chat_bubble
            </i>{" "}
            <FormattedMessage id="stepBodyFormInstances.addComments" />
          </span>
        </Menu.Item>

        <Menu.Item key={"pint"} onClick={this.printDiv}>
          <span>
            <i className="material-icons t-18 text-middle pd-right-sm">print</i>{" "}
            <FormattedMessage id="stepBodyFormInstances.printText" />
          </span>
        </Menu.Item>

        {/*<Menu.Item key={"printWorkflow"} onClick={this.toggleWorkflowPDFModal}>*/}
        {/*  <span>*/}
        {/*    <i className="material-icons t-18 text-middle pd-right-sm">*/}
        {/*      file_copy*/}
        {/*    </i>{" "}*/}
        {/*    <FormattedMessage id="stepBodyFormInstances.downloadWorkflowPDF" />*/}
        {/*  </span>*/}
        {/*</Menu.Item>*/}
      </Menu>
    );

    let selected_flag = null;
    if (_.size(props.workflow.selected_flag)) {
      selected_flag = props.workflow.selected_flag[props.workflow.id];
    }
    let that = this;
    const { isWorkflowPDFModalVisible } = this.state;
    const { workflow } = this.props;
    return (
      <Col span={5}>
        {this.props.detailsPage && !this.props.isEmbedded ? (
          <WorkflowPDFModal
            workflow={workflow}
            visible={isWorkflowPDFModalVisible}
            onOk={this.toggleWorkflowPDFModal}
            onCancel={this.toggleWorkflowPDFModal}
          />
        ) : null}
        <Row>
          <Col span={14}>
            <Tooltip title={this.state.current}>
              <div className="pd-left pd-right status-text text-light t-12 ">
                {this.state.current}
              </div>
            </Tooltip>
          </Col>
          <Col span={5} className="text-right">
            {props.showCommentIcon &&
            props.isEmbedded &&
            workflow.comments_allowed ? (
              <span>
                <div className="add_comment_btn">
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

            {this.state.showSidebar ? (
              <Drawer
                title="Activity log"
                placement="right"
                closable={true}
                //style={{top:'64px'}}
                onClose={this.toggleSidebar}
                visible={this.state.showSidebar}
                width={500}
                className="activity-log-drawer"
              >
                <AuditListTabs id={props.workflow.id} />
              </Drawer>
            ) : null}
          </Col>
          <Col span={5}>
            {this.props.detailsPage ? (
              <Dropdown
                overlay={workflowActionMenu}
                className="child-workflow-dropdown"
              >
                <span className="pd-ard-sm text-metal text-anchor">
                  <i className="material-icons text-middle t-18 ">more_vert</i>
                </span>
              </Dropdown>
            ) : null}
          </Col>
        </Row>
      </Col>
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
    return "#3c763d";
  } else if (value >= 4 && value <= 6) {
    return "#eebd47";
  } else if (value <= 3) {
    return "#f16b51";
  } else {
    return "#505050";
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
