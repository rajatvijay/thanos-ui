import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";
import {
  Button,
  Badge,
  Icon,
  Avatar,
  Progress,
  Dropdown,
  Menu,
  Divider,
  Row,
  Col,
  Tooltip,
  Tag,
  Steps,
  Popover,
  Drawer,
  Alert
} from "antd";
import { calculatedData } from "./calculated-data";
import { utils } from "./utils";
import { history } from "../../_helpers";
import { changeStatusActions, workflowDetailsActions } from "../../actions";
import Sidebar from "../common/sidebar";
import { FormattedMessage } from "react-intl";
import AuditListTabs from "../Navbar/audit_log";

const { getProcessedData, getProgressData } = calculatedData;
const { getVisibleSteps, isLockedStepEnable, isLockedStepGroupEnable } = utils;
const Step = Steps.Step;
const SubMenu = Menu.SubMenu;

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
const HeaderTitle = props => {
  let progressData = getProgressData(props.workflow);
  return (
    <Col span={6} className="text-left">
      {props.link ? (
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
            className=" text-base text-bold company-name text-ellipsis display-inline-block text-middle"
            title={props.workflow.name}
          >
            {props.workflow.name}
          </span>
        </Link>
      )}
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

const HeaderWorkflowGroup = props => {
  let progressData = getProgressData(props.workflow);
  let visible_steps = getVisibleSteps(props.workflow.step_groups);
  return (
    <Col span={11}>
      <div className="group-overview">
        <div className="overflow-wrapper">
          <div className="step-ui">
            {_.map(getProcessedData(props.workflow.step_groups), function(
              groupitem,
              index
            ) {
              if (!_.size(groupitem.steps)) {
                // checking for steps inside group
                return null;
              }
              if (!isLockedStepGroupEnable(groupitem, visible_steps)) {
                return null;
              }
              let completed = groupitem.is_complete;
              let od = groupitem.overdue;
              let groupProgress = getGroupProgress(groupitem);

              return (
                <span key={index} className="step-item">
                  <span className="pd-right-sm">
                    {groupProgress === 100 ? (
                      <i className="material-icons text-middle t-16 text-metal">
                        check_circle
                      </i>
                    ) : (
                      <i className="material-icons text-middle t-16 text-metal">
                        panorama_fish_eye
                      </i>
                    )}
                  </span>
                  <span
                    className={
                      completed
                        ? "title-c text-medium t-14 text-metal"
                        : od
                          ? "title-c text-red  text-medium t-14"
                          : "title-c text-metal text-medium t-14"
                    }
                  >
                    {groupitem.definition.name}
                  </span>
                </span>
              );
            })}
            <div>
              <Progress
                percent={progressData}
                showInfo={false}
                strokeColor={"#305ebe"}
                style={{ height: "4px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

class HeaderOptions2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.workflow.status.label,
      showSidebar: false
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
              message
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
      </Menu>
    );

    return (
      <Col span="4" className="text-right">
        <span className="status-text text-light t-12">
          {this.state.current}
        </span>

        {props.showCommentIcon && false ? (
          <span style={{ position: "relative", right: "25px" }}>
            <Badge count={5}>
              <i class="material-icons">comment</i>
            </Badge>
          </span>
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
          >
            <AuditListTabs id={props.workflow.id} />
          </Drawer>
        ) : null}

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
    );
  };
}

const HeaderOptions = props => {
  const menu = (
    <Menu onClick={props.onStatusChange}>
      {props.statusType
        ? _.map(props.statusType, function(status) {
            if (status.label !== props.workflow.status.label) {
              return <Menu.Item key={status.id}>{status.label}</Menu.Item>;
            }
          })
        : null}
    </Menu>
  );

  return (
    <Col span="5" className="text-right">
      {props.showCommentIcon && false ? (
        <span style={{ position: "relative", right: "25px" }}>
          <Badge count={5}>
            <i class="material-icons">comment</i>
          </Badge>
        </span>
      ) : null}
      <Dropdown overlay={menu}>
        <Button
          className="main-btn status-btn"
          type="main"
          title={props.workflow.status.label}
        >
          <span className="status-text">{props.workflow.status.label}</span>
          <Icon
            className="pd-left-sm icon"
            type="down"
            style={{ fontSize: 11 }}
          />
        </Button>
      </Dropdown>
    </Col>
  );
};

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

const GetQuickData = props => {
  const colors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple"
  ];

  return (
    <div className="group-overview">
      <div className="overflow-wrapper">
        {/* <div className="step-ui">
                 {_.map(props.workflow.lc_data, function(lcItem, index) {
                   return (
                     <span key={index} className="step-item">
                       <span className={"title-c text-normal text-light pd-right"}>
                         {lcItem.label}:
                       </span>
                       {props.column ? <br /> : null}
                       <span className={" text-normal  text-base"}>
                         <CheckData data={lcItem.value} />
                       </span>
                       {props.column ? null : <span className="dash"> </span>}
                     </span>
                   );
                 })}
               </div>*/}

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

export const WorkflowHeader = props => {
  let proccessedData = getProcessedData(props.workflow.step_groups);
  let progressData = getProgressData(props.workflow);

  return (
    <div className="ant-collapse-header">
      <Row type="flex" align="middle" className="lc-card-head">
        <Col span={1} className=" text-anchor">
          {props.detailsPage ? (
            <span onClick={history.goBack} className="text-anchor pd-ard-sm ">
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
                      className="material-icons"
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

        <HeaderTitle {...props} />

        {_.size(props.workflow.alerts) ? (
          <Col span={11}>
            <GetQuickData {...props} />
          </Col>
        ) : (
          <HeaderWorkflowGroup
            {...props}
            //progressData={progressData}
            pdata={proccessedData}
          />
        )}

        <Col span="2" className="text-center">
          {props.workflow.sorting_primary_field ? (
            <Badge
              count={<span>{props.workflow.sorting_primary_field}</span>}
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

//////////////////
/*workflow body*/
/////////////////

export const WorkflowBody = props => {
  return (
    <div className="lc-card-body">
      <div className="lc-card-section">
        {!props.statusView ? (
          <Row align="top">
            <Col span={24}>
              <GetQuickData {...props} column={true} />
            </Col>
          </Row>
        ) : (
          <StepGroupList {...props} />
        )}
      </div>
      <MetaRow {...props} />
    </div>
  );
};

class MetaRow extends React.Component {
  render = () => {
    const props = this.props;

    const relatedKind = props.relatedKind;

    const menuItems = () => {
      let workflowKindFiltered = [];

      _.map(props.relatedKind, function(item) {
        if (item.is_related_kind && _.includes(item.features, "add_workflow")) {
          workflowKindFiltered.push(item);
        }
      });

      return (
        <Menu onClick={props.onChildSelect}>
          {!_.isEmpty(workflowKindFiltered) ? (
            _.map(workflowKindFiltered, function(item, index) {
              return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
            })
          ) : (
            <Menu.Item disabled>No related workflow kind</Menu.Item>
          )}
        </Menu>
      );
    };

    const childWorkflowMenu = menuItems(props);

    return (
      <div>
        <Divider className="no-margin" />

        <div className="lc-card-section">
          <Row>
            <Col span="12">{props.hasChildren ? "show child" : null}</Col>
            <Col span="12" className="text-right">
              {props.relatedKind ? (
                <Dropdown
                  overlay={childWorkflowMenu}
                  className="child-workflow-dropdown"
                  placement="bottomRight"
                >
                  <a className="ant-dropdown-link ant-btn main-btn" href="#">
                    +{" "}
                    <FormattedMessage id="workflowsInstances.createChildButtonText" />
                    <i className="material-icons t-14">keyboard_arrow_down</i>
                  </a>
                </Dropdown>
              ) : null}
            </Col>
          </Row>
        </div>

        <Divider className="no-margin" />

        <div className="lc-card-section">
          <Row>
            <Col span="18" className=" t-12">
              {props.workflow.lc_duedate ? (
                <span>
                  <span className="text-bold text-primary">
                    EAT {props.workflow.lc_duedate}
                  </span>
                  <span className="pd-left pd-right">|</span>
                </span>
              ) : null}

              {props.workflow.lc_id ? (
                <span>
                  <span className="text-light">
                    <b>ID: </b> {props.workflow.lc_id}
                  </span>
                  <span className="pd-left pd-right">|</span>
                </span>
              ) : null}

              <span className="text-light">
                <FormattedMessage id="commonTextInstances.createdText" />
                <Moment fromNow>{props.workflow.created_at}</Moment>
              </span>
            </Col>

            <Col span="6" className="text-right text-light small">
              <Link to={"/workflows/instances/" + props.workflow.id}>
                <span className="pd-ard-sm text-nounderline">
                  <FormattedMessage id="workflowsInstances.viewDetails" /> ⟶
                </span>
              </Link>
            </Col>
          </Row>
          {props.workflow.lc_message ? (
            <Row>
              <Col span="24" className="mr-top">
                <Alert
                  message={props.workflow.lc_message}
                  type="info"
                  showIcon
                />
              </Col>
            </Row>
          ) : null}
        </div>
      </div>
    );
  };
}

const StepGroupList = props => {
  let visible_steps = getVisibleSteps(props.pData);
  return (
    <div className="sub-step-list">
      <ul className="groupaz-list" id="groupaz-list">
        {_.map(props.pData, function(group, index) {
          let completed = group.completed;
          let od = group.overdue;

          if (!_.size(group.steps)) {
            return null;
          }
          if (!isLockedStepGroupEnable(group, visible_steps)) {
            return null;
          }
          return (
            <li className="groupaz" key={"group-" + index}>
              <div
                className={
                  "lc-step grp-class step-group-status text-ellipsis  " +
                  group.definition.status
                }
              >
                <span
                  className={
                    "grp-name " +
                    (completed
                      ? "text-metal text-medium"
                      : od ? "text-red text-red" : "text-metal  text-normal")
                  }
                >
                  <i className="material-icons mr-right-lg ">
                    {completed ? "check_circle" : "panorama_fish_eye"}
                  </i>
                  <span className=" pd-left-sm t-14">
                    {group.definition.name}
                  </span>
                </span>
              </div>
              <ul>
                {_.map(group.steps, function(steps, index) {
                  return (
                    <StepItem
                      {...props}
                      stepData={steps}
                      group={group}
                      visible_steps={visible_steps}
                      key={"step-" + index}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const StepItem = props => {
  let step_complete = props.stepData.completed_at ? true : false;
  let overdue = props.stepData.overdue ? true : false;
  let icon_cls = "panorama_fish_eye";
  if (step_complete) {
    icon_cls = "check_circle";
  } else if (props.stepData.is_locked) {
    icon_cls = "lock";
    // if (!isLockedStepEnable(props.stepData, props.visible_steps)) {
    //   return null;
    // }
  } else if (overdue) {
    icon_cls = "alarm";
  }

  let hasAlert = null;

  if (_.size(props.workflow.alerts)) {
    _.forEach(props.workflow.alerts, function(value) {
      if (value.step === props.stepData.id) {
        hasAlert = value;
      }
    });
  }

  return (
    <li className={"t-14 "} title={props.stepData.name}>
      <Link
        to={
          "/workflows/instances/" +
          props.workflow.id +
          "?group=" +
          props.group.id +
          "&step=" +
          props.stepData.id
        }
        className={
          step_complete
            ? "text-metal text-nounderline text-bold"
            : overdue
              ? "text-red text-nounderline text-normal"
              : "text-metal text-nounderline text-normal"
        }
      >
        <i className="material-icons text-middle">{icon_cls}</i>
        <span>{props.stepData.name}</span>
        {_.size(hasAlert) ? (
          <span className="float-right pd-left">
            <Tooltip title={hasAlert.alert.category.name}>
              <Badge status="error" />
            </Tooltip>
          </span>
        ) : null}
      </Link>
    </li>
  );
};

//export default WorkflowItem;
