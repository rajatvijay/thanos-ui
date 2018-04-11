import React, { Component } from "react";
import Redux from "redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import _ from "lodash";
import {
  Button,
  Layout,
  Icon,
  Panel,
  Avatar,
  Progress,
  Dropdown,
  Menu,
  Divider,
  Row,
  Col,
  Tag
} from "antd";

const { item } = Menu;

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

/*workflow Head*/
const HeaderTitle = props => {
  return (
    <Col span={7}>
      <Avatar>{props.workflow.name.charAt(0)}</Avatar>
      <span className="mr-left-sm text-grey-dark text-medium">
        {props.workflow.name}
      </span>
    </Col>
  );
};

const HeaderWorkflowGroup = props => {
  return (
    <Col span={10}>
      <div className="group-overview">
        <div>
          {_.map(props.workflow.step_groups, function(groupitem, index) {
            return (
              <span
                className={"grp-status text-medium mr-right-lg text-metal"}
                key={"item-" + index}
              >
                <i
                  className="material-icons md-18"
                  style={{
                    fontSize: "14px",
                    marginRight: "5px",
                    verticalAlign: "middle",
                    width: "18px"
                  }}
                >
                  panorama_fish_eye_
                </i>
                <span>{groupitem.step_group_def.label}</span>
              </span>
            );
          })}
        </div>
        <Progress showInfo={false} percent={0} />
      </div>
    </Col>
  );
};

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.taobao.com/"
      >
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

const HeaderOptions = props => {
  return (
    <Col span="6">
      <Row>
        <Col span={16} className="text-right">
          <Tag color={getStatusColor(props.workflow.status.label)}>
            {props.workflow.status.label}
          </Tag>{" "}
        </Col>

        <Col span="8" className="text-center " style={{ position: "relative" }}>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="">
              <Icon type="down" />
            </a>
          </Dropdown>
        </Col>
      </Row>
    </Col>
  );
};

const WorkflowHeader = props => {
  return (
    <Row type="flex" align="middle" className="lc-card-head">
      <Col span={1} className="text-center text-metal ">
        <Icon type="copy" />
      </Col>
      <HeaderTitle {...props} />
      <HeaderWorkflowGroup {...props} />
      <HeaderOptions {...props} />
    </Row>
  );
};

/*workflow body*/
const Workflowbody = props => {
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
      <ul className="groupaz-list">
        {_.map(props.workflow.step_groups, function(group, index) {
          return (
            <li className="groupaz" key={"group-" + index}>
              <div
                className={
                  "lc-step grp-class step-group-status text-metal " +
                  group.step_group_def.status
                }
              >
                <i className="material-icons">panorama_fish_eye_</i>{" "}
                {group.step_group_def.label}
              </div>
              <ul>
                {_.map(group.steps, function(steps, index) {
                  return (
                    <StepItem
                      {...props}
                      stepData={steps}
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
  console.log(props);
  return (
    <li className={"text-metal"}>
      <Link
        to={
          "/workflows/instances/" +
          props.workflow.id +
          "?step=" +
          props.stepData.id
        }
        className="text-nounderline text-metal"
      >
        <i className="material-icons">panorama_fish_eye_</i>
        <span>{props.stepData.name}</span>
      </Link>
    </li>
  );
};

export const WorkflowHeader2 = WorkflowHeader;
export const WorkflowBody2 = Workflowbody;

//export default WorkflowItem;
