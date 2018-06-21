import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";
import {
  Button,
  Icon,
  Avatar,
  Progress,
  Dropdown,
  Menu,
  Divider,
  Row,
  Col,
  Tag,
  Steps,
  Popover
} from "antd";
import { calculatedDate } from "./calculated-data";

const { getProcessedData, getProgressData } = calculatedDate;
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
    <Col span={5}>
      <Link
        to={"instances/" + props.workflow.id + "/"}
        className="text-nounderline"
      >
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
            width={45}
            format={percent => (
              <Avatar size="large">{props.workflow.name.charAt(0)}</Avatar>
            )}
          />
        </Popover>

        <span className="mr-left-sm text-grey-dark text-medium">
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
  return (
    <Col span={12}>
      <div className="group-overview">
        <div className="overflow-wrapper">
          <Scrollbars autoWidth autoHide autoHeight>
            <Steps className="step-ui">
              {_.map(getProcessedData(props.workflow.step_groups), function(
                groupitem,
                index
              ) {
                let completed = groupitem.completed;
                let od = groupitem.overdue;
                let groupProgress = getGroupProgress(groupitem);

                return (
                  <Step
                    key={index}
                    title={
                      <span
                        className={
                          completed
                            ? "title-c text-primary"
                            : od ? "title-c text-red" : "title-c text-metal"
                        }
                      >
                        {groupitem.definition.name}
                      </span>
                    }
                    className="step-item"
                    status={completed ? "wait" : od ? "error" : "finish"}
                    icon={
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
                        <Progress
                          type="circle"
                          percent={groupProgress}
                          width={30}
                          format={percent => (
                            <i className="material-icons">
                              {groupitem.definition.icon}
                            </i>
                          )}
                        />
                      </Popover>
                    }
                  />
                );
              })}
            </Steps>
          </Scrollbars>
        </div>
      </div>
    </Col>
  );
};

const HeaderOptions = props => {
  console.log("props----");
  console.log(props);

  const getStatusColor = status => {
    status = status.toUpperCase();
    switch (status) {
      case "IN PROGRESS":
        return "orange";
      case "EXPIRED":
        return "red";
      case "STALLED":
        return "grey";
      case "COMPLETED":
        return "green";
      default:
        return "grey";
    }
  };

  const menu = (
    <Menu>
      {props.statusType
        ? _.map(props.statusType.results, function(status) {
            if (status.label !== props.workflow.status.label) {
              return <Menu.Item key={status.label}>{status.label}</Menu.Item>;
            }
          })
        : null}
    </Menu>
  );

  return (
    <Col span="6">
      <Row>
        <Col span={16} className="text-right">
          <Dropdown overlay={menu}>
            <Tag
              color={getStatusColor(
                props.workflow.status
                  ? props.workflow.status.label
                  : "In Progress "
              )}
            >
              {props.workflow.status ? (
                <span>
                  {props.workflow.status.label}{" "}
                  <Icon
                    className="pd-left-sm"
                    type="down"
                    style={{ fontSize: 11 }}
                  />
                </span>
              ) : (
                <span>
                  In Progress{" "}
                  <Icon
                    className="pd-left-sm"
                    type="down"
                    style={{ fontSize: 11 }}
                  />
                </span>
              )}
            </Tag>
          </Dropdown>
        </Col>

        <Col
          span="8"
          className="text-right pd-right "
          style={{ position: "relative" }}
        >
          <a className="ant-dropdown-link" href="#">
            <i className="material-icons text-primary opacity-half">
              more_vert{" "}
            </i>
          </a>
        </Col>
      </Row>
    </Col>
  );
};

export const WorkflowHeader = props => {
  let proccessedData = getProcessedData(props.workflow.step_groups);

  return (
    <div className="ant-collapse-header">
      <Row type="flex" align="middle" className="lc-card-head">
        <Col span={1} className="text-center text-metal text-anchor">
          <Icon type="copy" style={{ fontSize: "18px" }} />
          {/*<Tooltip title="workf kind">
                </Tooltip>*/}
        </Col>
        <HeaderTitle {...props} />

        <HeaderWorkflowGroup
          {...props}
          //progressData={progressData}
          pdata={proccessedData}
        />

        <HeaderOptions {...props} />
      </Row>
    </div>
  );
};

//////////////////
/*workflow body*/
/////////////////

export const WorkflowBody = props => {
  const menuItems = () => {
    let realtedKind = props.realtedKind;

    return (
      <Menu onClick={props.onChildSelect}>
        {!_.isEmpty(realtedKind) ? (
          _.map(props.realtedKind, function(item, index) {
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
    <div className="lc-card-body">
      <Row>
        <Col span="12" className="">
          <Link to={"/workflows/instances/" + props.workflow.id}>
            <Button type="primary">View details</Button>
          </Link>
        </Col>
        <Col span="12" className="text-right text-light small">
          <Moment format="YYYY/MM/DD">{props.workflow.created_at}</Moment>{" "}
          <b>&middot;</b> #{props.workflow.id} <b>&middot;</b>{" "}
          <Dropdown
            overlay={childWorkflowMenu}
            className="child-workflow-dropdown"
            placement="bottomRight"
          >
            <a className="ant-dropdown-link ant-btn" href="#">
              Add child workflow{" "}
              <i className="material-icons t-14">keyboard_arrow_down</i>
            </a>
          </Dropdown>
        </Col>
      </Row>
      <Divider />
      <StepGroupList {...props} />
    </div>
  );
};

const StepGroupList = props => {
  return (
    <div className="sub-step-list">
      <ul className="groupaz-list" id="groupaz-list">
        {_.map(props.pData, function(group, index) {
          let completed = group.completed;
          let od = group.overdue;

          return (
            <li className="groupaz" key={"group-" + index}>
              <div
                className={
                  "lc-step grp-class step-group-status text-metal " +
                  group.definition.status
                }
              >
                <span
                  className={
                    "grp-name " +
                    (completed
                      ? "text-primary"
                      : od ? "text-red" : "text-metal")
                  }
                >
                  <i className="material-icons">{group.definition.icon}</i>{" "}
                  {group.definition.name}
                </span>
              </div>
              <ul>
                {_.map(group.steps, function(steps, index) {
                  return (
                    <StepItem
                      {...props}
                      stepData={steps}
                      group={group}
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

  return (
    <li className={""} title={props.stepData.name}>
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
            ? "text-primary text-nounderline"
            : overdue
              ? "text-red text-nounderline"
              : "text-metal text-nounderline"
        }
      >
        <i className="material-icons">
          {step_complete ? "check_circle" : "panorama_fish_eye"}{" "}
        </i>
        <span>{props.stepData.name}</span>
      </Link>
    </li>
  );
};

//export default WorkflowItem;
