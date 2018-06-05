import React, { Component } from "react";
//import Redux from "redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import _ from "lodash";
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
  Popover,
  Tooltip
} from "antd";
import { calculatedDate } from "./calculated-data";

const { getProcessedData, getProgressData } = calculatedDate;
const Step = Steps.Step;

/*workflow Head*/
const HeaderTitle = props => {
  return (
    <Col span={5}>
      <Link
        to={"instances/" + props.workflow.id + "/"}
        className="text-nounderline"
      >
        <Avatar size="large">{props.workflow.name.charAt(0)}</Avatar>

        <span className="mr-left-sm text-grey-dark text-medium">
          {props.workflow.name}
        </span>
      </Link>
    </Col>
  );
};

const HeaderWorkflowGroup = props => {
  let progressData = getProgressData(props.workflow);
  return (
    <Col span={12}>
      <div className="group-overview">
        <div className="overflow-wrapper">
          {_.map(getProcessedData(props.workflow.step_groups), function(
            groupitem,
            index
          ) {
            let completed = groupitem.completed;
            let od = groupitem.overdue;
            return (
              <span
                className={
                  "grp-status text-medium mr-right-lg " +
                  (completed ? "text-primary" : od ? "text-red" : "text-metal")
                }
                key={"item-" + index}
              >
                {/* <i
                                     className="material-icons md-18"
                                     style={{
                                       fontSize: "14px",
                                       marginRight: "5px",
                                       verticalAlign: "middle",
                                       width: "18px"
                                     }}
                                   >
                                     {completed
                                       ? "check_circle"
                                       : od ? "alarm" : "panorama_fish_eye"}
                                   </i>*/}

                <i
                  className="material-icons md-18"
                  style={{
                    fontSize: "20px",
                    marginRight: "10px",
                    verticalAlign: "middle",
                    width: "18px"
                  }}
                >
                  {completed
                    ? "check_circle_outline"
                    : groupitem.definition.icon
                      ? groupitem.definition.icon
                      : "check_circle"}
                </i>

                <span>{groupitem.definition.name}</span>
              </span>
            );
          })}
          <div>
            <Progress percent={progressData} showInfo={false} />
          </div>
        </div>
      </div>
    </Col>
  );
};

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">
        Archive
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">
        On hold
      </a>
    </Menu.Item>
  </Menu>
);

const menu2 = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">
        Refresh Preview
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">
        Add site
      </a>
    </Menu.Item>
  </Menu>
);

const HeaderOptions = props => {
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
          <Dropdown overlay={menu2}>
            <a className="ant-dropdown-link" href="#">
              <i className="material-icons text-primary opacity-half">
                more_vert{" "}
              </i>
            </a>
          </Dropdown>
        </Col>
      </Row>
    </Col>
  );
};

export const WorkflowHeader = props => {
  let proccessedData = getProcessedData(props.workflow.step_groups);
  //let progressData = getProgressData(props.workflow);

  console.log("this workf porps kind saf");
  console.log(props);

  return (
    <Row type="flex" align="middle" className="lc-card-head">
      <Col span={1} className="text-center text-metal ">
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
  );
};

/*workflow body*/
export const WorkflowBody = props => {
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
          <b>&middot;</b> #{props.workflow.increment_id}{" "}
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
