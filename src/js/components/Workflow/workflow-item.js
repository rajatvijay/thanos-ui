import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
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
import AuditList from "../Navbar/audit_log";

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
    <Col span={5} className="text-left">
      <Link
        to={"/workflows/instances/" + props.workflow.id + "/"}
        className="text-nounderline"
      >
        <span
          className=" text-base text-bold company-name text-ellipsis display-inline-block text-middle"
          title={props.workflow.name}
        >
          {props.workflow.name}
        </span>
      </Link>
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

const HeaderWorkflowGroup = props => {
  let progressData = getProgressData(props.workflow);
  let visible_steps = getVisibleSteps(props.workflow.step_groups);
  return (
    <Col span={12}>
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
                    <Popover
                      content={
                        <div className="text-center">
                          {groupitem.definition.name}
                          <div className="small">
                            {groupProgress}% completed
                          </div>
                        </div>
                      }
                    >
                      {groupProgress === 100 ? (
                        <i className="material-icons text-middle t-18 text-secondary">
                          check_circle_outline
                        </i>
                      ) : (
                        <Progress
                          showInfo={false}
                          type="circle"
                          percent={groupProgress}
                          width={18}
                          strokeWidth={8}
                        />
                      )}
                    </Popover>
                  </span>
                  <span
                    className={
                      completed
                        ? "title-c text-medium text-secondary"
                        : od
                          ? "title-c text-red text-normal "
                          : "title-c text-normal text-base"
                    }
                  >
                    {groupitem.definition.name}
                  </span>
                  <span className="dash"> </span>
                </span>
              );
            })}
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

    return (
      <Col span="5" className="text-right">
        {props.showCommentIcon && false ? (
          <span style={{ position: "relative", right: "25px" }}>
            <Badge count={5}>
              <i class="material-icons">comment</i>
            </Badge>
          </span>
        ) : null}

        {this.props.detailsPage ? (
          <span>
            <Tooltip title="Comments">
              <span
                className="mr-right mr-left text-anchor display-inline-block text-light"
                onClick={this.openCommentSidebar}
              >
                <i className="material-icons t-22">message</i>
              </span>
            </Tooltip>

            <Tooltip title="View activity log">
              <span
                className="mr-right mr-left text-anchor display-inline-block text-light"
                onClick={this.toggleSidebar}
              >
                <i className="material-icons t-22">restore</i>
              </span>
            </Tooltip>
          </span>
        ) : null}

        <Tooltip title={props.workflow.status.label}>
          <Button
            className="main-btn status-btn"
            type="main"
            title={props.workflow.status.label}
          >
            <span className="status-text">{this.state.current}</span>
            {/*<Icon
                          className="pd-left-sm icon"
                          type="down"
                          style={{ fontSize: 11 }}
                        />*/}
          </Button>
        </Tooltip>
        {/*<Dropdown overlay={menu} >
                </Dropdown>*/}
        {this.state.showSidebar ? (
          <Drawer
            title="Activity log"
            placement="right"
            closable={true}
            //style={{top:'64px'}}
            onClose={this.toggleSidebar}
            visible={this.state.showSidebar}
            width={300}
          >
            <AuditList id={props.workflow.id} />
          </Drawer>
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
  let icon = returnKind[0].icon;

  if (icon) {
    return icon;
  } else {
    return "folder_open";
  }
};

const GetQuickData = props => {
  return (
    <div className="group-overview">
      <div className="overflow-wrapper">
        <div className="step-ui">
          {_.map(
            _.orderBy(
              props.workflow.lc_data,
              [step => step.label.toLowerCase()],
              ["desc"]
            ),
            function(lcItem, index) {
              return (
                <span key={index} className="step-item">
                  <span className={"title-c text-normal text-light pd-right"}>
                    {lcItem.label}:
                    <span className={" text-normal pd-left text-base"}>
                      {lcItem.value}
                    </span>
                  </span>
                  <span className="dash"> </span>
                </span>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export const WorkflowHeader = props => {
  let proccessedData = getProcessedData(props.workflow.step_groups);
  let progressData = getProgressData(props.workflow);

  return (
    <div className="ant-collapse-header">
      <Row type="flex" align="middle" className="lc-card-head">
        <Col span={2} className="text-center text-anchor">
          {props.detailsPage ? (
            <span onClick={history.goBack} className="text-anchor pd-ard-sm ">
              <i
                className="material-icons"
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

        {!props.statusView ? (
          <Col span={12}>
            <GetQuickData {...props} />
          </Col>
        ) : (
          <HeaderWorkflowGroup
            {...props}
            //progressData={progressData}
            pdata={proccessedData}
          />
        )}

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
      <MetaRow {...props} />
      <Divider />

      {!props.statusView ? (
        <Col span={24}>
          <GetQuickData {...props} column={true} />
        </Col>
      ) : (
        <StepGroupList {...props} />
      )}
    </div>
  );
};

class MetaRow extends React.Component {
  render = () => {
    const props = this.props;

    const relatedKind = props.relatedKind;

    const menuItems = () => {
      return (
        <Menu onClick={props.onChildSelect}>
          {!_.isEmpty(relatedKind) ? (
            _.map(props.relatedKind, function(item, index) {
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
        <Row>
          <Col span="18" className="">
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
                <span className="">
                  <b>ID: </b> {props.workflow.lc_id}
                </span>
                <span className="pd-left pd-right">|</span>
              </span>
            ) : null}
            <span className="pd-left">
              Created <Moment fromNow>{props.workflow.created_at}</Moment>
            </span>
            <span className="pd-left pd-right">|</span>
            <Link to={"/workflows/instances/" + props.workflow.id}>
              <span className="pd-ard-sm text-medium text-base text-underline">
                View details
              </span>
            </Link>
          </Col>
          <Col span="6" className="text-right text-light small">
            {props.relatedKind ? (
              <Dropdown
                overlay={childWorkflowMenu}
                className="child-workflow-dropdown"
                placement="bottomRight"
              >
                <a className="ant-dropdown-link ant-btn secondary-btn" href="#">
                  Add <i className="material-icons t-14">keyboard_arrow_down</i>
                </a>
              </Dropdown>
            ) : null}
          </Col>
        </Row>
        {props.workflow.lc_message ? (
          <Row>
            <Col span="24" className="mr-top">
              <Alert message={props.workflow.lc_message} type="info" showIcon />
            </Col>
          </Row>
        ) : null}
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
                  "lc-step grp-class step-group-status  " +
                  group.definition.status
                }
              >
                <span
                  className={
                    "grp-name " +
                    (completed
                      ? "text-secondary text-medium"
                      : od ? "text-red text-normal" : "text-light  text-normal")
                  }
                >
                  <i className="material-icons mr-right-lg ">
                    {completed ? "check_circle_outline" : "panorama_fish_eye"}
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
    icon_cls = "check_circle_outline";
  } else if (props.stepData.is_locked) {
    icon_cls = "lock";
    if (!isLockedStepEnable(props.stepData, props.visible_steps)) {
      return null;
    }
  } else if (overdue) {
    icon_cls = "alarm";
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
            ? "text-secondary text-nounderline text-medium"
            : overdue
              ? "text-red text-nounderline text-normal"
              : "text-base text-nounderline text-normal"
        }
      >
        <i className="material-icons text-middle">{icon_cls}</i>
        <span>{props.stepData.name}</span>
      </Link>
    </li>
  );
};

//export default WorkflowItem;
