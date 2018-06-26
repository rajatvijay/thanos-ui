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
import { history } from "../../_helpers";

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
          <span className="mr-left-sm text-base text-bold company-name">
            {props.workflow.name}
          </span>
        </Popover>
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
          <Scrollbars autoWidth autoHide style={{ height: "25px" }}>
            <div className="step-ui">
              {_.map(getProcessedData(props.workflow.step_groups), function(
                groupitem,
                index
              ) {
                let completed = groupitem.completed;
                let od = groupitem.overdue;
                let groupProgress = getGroupProgress(groupitem);

                return (
                  <span key={index} className="step-item">
                    <span
                      className={
                        completed
                          ? "title-c text-medium text-base"
                          : od
                            ? "title-c text-red text-normal "
                            : "title-c text-normal text-light"
                      }
                    >
                      {groupitem.definition.name}
                    </span>
                    <span className="dash"> -</span>
                  </span>
                );
              })}
            </div>
          </Scrollbars>
        </div>
      </div>
    </Col>
  );
};

const HeaderOptions = props => {
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
    <Col span="6" className="text-right">
      <Dropdown overlay={menu}>
        <Button className="main-btn" type="main">
          {props.workflow.status.label}
          <Icon className="pd-left-sm" type="down" style={{ fontSize: 11 }} />
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
    return "folder";
  }
};

export const WorkflowHeader = props => {
  let proccessedData = getProcessedData(props.workflow.step_groups);
  return (
    <div className="ant-collapse-header">
      <Row type="flex" align="middle" className="lc-card-head">
        <Col span={1} className="text-center text-anchor">
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
            <i
              className="material-icons"
              style={{ fontSize: "18px", verticalAlign: "middle" }}
            >
              {props.kind === ""
                ? getIcon(props.workflow.definition.kind, props.kind)
                : "folder"}
            </i>
          )}
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
          {!props.isChild ? (
            props.realtedKind.length !== 0 ? (
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
            ) : null
          ) : null}
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

          if (!_.size(group.steps)) {
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
                      ? "text-base text-medium"
                      : od ? "text-red text-normal" : "text-light  text-normal")
                  }
                >
                  <i className="material-icons mr-right-lg ">
                    {group.definition.icon}
                  </i>
                  <span className="text-underline pd-ard-sm">
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
  let icon_cls = "";
  if (step_complete) {
    icon_cls = "check_circle";
  } else if (props.stepData.is_locked) {
    icon_cls = "lock";
  } else if (overdue) {
    icon_cls = "trending_flat";
  }

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
            ? "text-base text-nounderline text-medium"
            : overdue
              ? "text-red text-nounderline text-normal"
              : "text-light text-nounderline text-normal"
        }
      >
        <i className="material-icons">{icon_cls}</i>
        <span>{props.stepData.name}</span>
      </Link>
    </li>
  );
};

//export default WorkflowItem;
