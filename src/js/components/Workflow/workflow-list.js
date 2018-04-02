import React, { Component } from "react";
import {
  Layout,
  Collapse,
  Icon,
  Row,
  Col,
  Avatar,
  Progress,
  Tag,
  Button,
  Popover,
  Divider
} from "antd";
import Moment from "react-moment";
import { Link } from "react-router-dom";

//import {WorkflowCardHeader, WorkflowCardBody} from "./workflow-card-details";
import _ from "lodash";

const Config = {
  user: {
    id: 1
  }
};

const { Content } = Layout;

const Panel = Collapse.Panel;

class Header extends Component {
  constructor(props) {
    super(props);
    //const state = {}
  }

  componentDidMount() {}

  getHeaderGroup() {
    //var that = this;
    var workflowData = this.props.workflowData;
    var tot = 0,
      pen = 0,
      com = 0,
      prog = 0;
    return (
      <div>
        <div className="group-overview">
          {_.map(workflowData.step_groups, function(w, key) {
            var icon = "circle_check",
              color = "text-green";
            _.map(w.steps, function(s, key) {
              tot = tot + 1;
              if (s.completed_at === null) {
                pen = pen + 1;
                color = "text-primary";
                icon = "panorama_fish_eye";
              } else {
                com = com + 1;
              }

              if (s.waitingOn === "you") {
                color = "text-orange";
              } else if (s.locked) {
                color = "text-muted";
                icon = "lock";
              }
            });

            return (
              <span
                className={"grp-status text-medium mr-right-lg " + color}
                key={"l" + key}
              >
                <i
                  className="material-icons md-18"
                  style={{
                    fontSize: "14px",
                    marginRight: "5px",
                    verticalAlign: "middle"
                  }}
                >
                  {icon}
                </i>
                <span>{w.id}</span>
              </span>
            );
          })}
        </div>

        <div>
          <Progress
            showInfo={false}
            percent={tot === 0 ? 0 : com / tot * 100}
          />
          {/*<Progress percent={(that.state.completedSteps/that.state.totalSteps) *100} successPercent={(that.state.waitingTask/that.state.totalSteps) *100} />*/}
        </div>
      </div>
    );
  }

  getStatusColor(status) {
    var status = status.toUpperCase();
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
  }

  render() {
    const workflowData = this.props.workflowData;
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );

    return (
      <Row type="flex" align="middle" className="lc-card-head">
        <Col span={1} className="text-center text-metal ">
          <Icon type="copy" />
        </Col>
        <Col span={7}>
          <Avatar>{workflowData.name.toString().charAt(0)}</Avatar>
          <span className="mr-left-sm text-grey-dark text-medium">
            {workflowData.name}
          </span>
        </Col>
        <Col span={10}>{this.getHeaderGroup()}</Col>
        <Col span={4} className="text-right">
          <Tag color={this.getStatusColor(workflowData.status.label)}>
            {workflowData.status.label}
          </Tag>{" "}
        </Col>
        <Col span={2} className="text-center " style={{ position: "relative" }}>
          <Popover
            placement="bottomRight"
            content={content}
            title="Title"
            trigger="hover"
          >
            <Icon
              type="solution"
              style={{
                position: "absolute",
                fontSize: "18px",
                right: "48px",
                top: "-8px"
              }}
              className=" text-primary"
            />
          </Popover>

          <Popover
            placement="bottomRight"
            content={content}
            title="Title"
            trigger="hover"
          >
            <i
              style={{
                position: "absolute",
                fontSize: "18px",
                right: "16px",
                top: "-8px"
              }}
              className=" text-primary material-icons md-24"
            >
              more_vert
            </i>
          </Popover>
        </Col>
      </Row>
    );
  }
}

class WorkflowCardBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {
        totalSteps: 0,
        waitingTask: 0,
        completedSteps: 0,
        warningStep: 0,
        runningLate: 0,
        myTask: 0
      }
    };
    console.log("this.props---- card body");
    console.log(this.props);
  }

  getSteps = (value, key) => {
    console.log("value-----------------");
    console.log(value);
    var that = this;
    const stats = this.state.stats;

    var subSteps = (
      <ul>
        {_.map(value.steps, function(s, index) {
          //add later // _.filter(value, "status.is_enabled", true
          console.log("s----------");
          console.log(s);
          var _statusIcon = (s.status || {}).completed_at
            ? "check_circle"
            : " panorama_fish_eye";
          var stepStatus = "text-metal";

          // stats.totalSteps++;

          // if ((s.status || {}).needs_approval) {
          //   stepStatus = "text-orange hint--top";
          //   stats.waitingTask++;
          // } else if ((s.status || {}).completed_at) {
          //   stepStatus = "text-green opacity-half";
          //   stats.completedSteps++;
          // } else {
          //   if ((s.status || {}).should_raise_error) {
          //     _statusIcon = "report_problem";
          //     stats.warningStep++;
          //   } else if ((s.status || {}).is_locked) {
          //     _statusIcon = "lock";
          //   } else if ((s.status || {}).is_overdue) {
          //     stepStatus = "text-red";
          //     _statusIcon = " alarm";
          //     stats.runningLate++;
          //   }
          // }

          // var waitingOn = "";

          // if (
          //   _.includes((s.status || {}).users, Config.user.id) &&
          //   !(s.status || {}).completed_at
          // ) {
          //   var intizaar = "text-orange text-bold text-highlight";
          //   stepStatus = "text-orange hint--top";
          //   if (!(s.status || {}).is_locked) {
          //     stats.myTask++;
          //   }
          //   var waitingOn = "Waiting on you";
          // } else if (
          //   _.includes((s.status || {}).approvers, Config.user.id) &&
          //   (s.status || {}).completed_at &&
          //   (s.status || {}).needs_approval
          // ) {
          //   var intizaar = "text-orange text-bold text-highlight hint--top";
          //   stepStatus = "text-orange ";
          //   if (!(s.status || {}).is_locked) {
          //     stats.myTask++;
          //   }
          //   var waitingOn = "Waiting on you";
          // }

          // if (s.score) {
          //   var step_score = (
          //     <span
          //       className={"grade-badge notranslate grade-badge-sm grade-b"}
          //     >
          //       b
          //     </span>
          //   );
          // } else {
          //   var step_score = null;
          // }

          // if (s.status.error_flag) {
          //   var flag =
          //     s.status.error_flag === "red_flag"
          //       ? "text-danger"
          //       : "text-warning";
          //   var error_msg = s.status.error_flag_message.split("|").join("\n");
          //   var step_error_flag = (
          //     <span aria-label={error_msg} className="hint--top">
          //       <i className={"fa fa-flag " + flag} />
          //     </span>
          //   );
          // } else {
          //   var step_error_flag = null;
          // }
          var step_error_flag = null;

          return (
            <li key={"key-" + index}>
              <Link
                to={
                  "/workflows/instances/" +
                  that.props.workflowData.id +
                  "?step=" +
                  s.id
                }
                className="lc-step no-underline"
                key={s.id}
              >
                <span className={"stepStatus"} aria-label={"waitingOn"}>
                  <i className={"material-icons notranslate " + " _statusIcon"}>
                    {_statusIcon}
                  </i>&nbsp;&nbsp;
                  <span className={"intizaar " + " notranslate"}>
                    {s.name}
                    {s.id}
                  </span>&nbsp;&nbsp;
                  {/*step_score*/}
                  {step_error_flag}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );

    return subSteps;
  };

  getGroups = () => {
    var that = this;
    const stats = this.state.stats;

    var grouping = this.props.workflowData.step_groups;
    var groups = this.props.workflowData.step_groups;

    var subStepList = (
      <span className="sub-step-list o">
        {_.map(grouping, function(value, key) {
          var value = value;
          console.log("value-----------------");
          console.log(value, key);

          var groupStatus = "text-metal";

          if (key !== "undefined") {
            var group_obj = _.find(groups, { label: key });
            var groupStatus = "text-metal";
            var _groupIcon = " panorama_fish_eye";

            //group object satus
            if (group_obj) {
              if (group_obj.status === "approval") {
                groupStatus = "text-orange";
                _groupIcon = " check_circle";
              } else if (group_obj.status === "complete") {
                groupStatus = "text-green";
                _groupIcon = " check_circle";
              } else {
                if (group_obj.status === "locked") {
                  _groupIcon = "lock";
                } else if (group_obj.status === "overdue") {
                  groupStatus = "text-red alarm";
                  _groupIcon = "alarm";
                }
              }
            }
            //group object score
            if (group_obj && group_obj.score) {
              var groupScore = (
                <span
                  className={"grade-badge notranslate grade-badge-sm grade-b"}
                >
                  b
                </span>
              );
            } else {
              var groupScore = null;
            }

            var subSteps = that.getSteps(value, key);

            return (
              <div className="groupaz" key={key}>
                <div>
                  <span
                    className={
                      "lc-step no-underline text-uppercase grp-class " +
                      groupStatus
                    }
                  >
                    <span>
                      <i
                        className={"material-icons notranslate  " + _groupIcon}
                      >
                        {_groupIcon}
                      </i>{" "}
                      {subSteps ? key : null}
                    </span>&nbsp;&nbsp;
                    {groupScore}
                  </span>
                </div>
                <div className="">{subSteps ? subSteps : null}</div>
              </div>
            );
          }

          return (
            <div className="groupaz orphan">
              <ul>
                {_.map(value.steps, function(s, index) {
                  //add filter later _.filter(value, "status.is_enabled", true)

                  console.log(s);
                  var _statusIcon = (s.status || {}).completed_at
                    ? "check_circle"
                    : " panorama_fish_eye";
                  var stepStatus = "text-metal";

                  stats.totalSteps++;

                  if ((s.status || {}).needs_approval) {
                    stepStatus = "text-orange";
                    stats.waitingTask++;
                  } else if ((s.status || {}).completed_at) {
                    stepStatus = "text-green opacity-half";
                    stats.completedSteps++;
                  } else {
                    if ((s.status || {}).should_raise_error) {
                      _statusIcon = "report_problem";
                      stats.warningStep++;
                    } else if ((s.status || {}).is_locked) {
                      _statusIcon = "lock";
                    } else if ((s.status || {}).is_overdue) {
                      stepStatus = "text-red";
                      _statusIcon = " alarm";
                      stats.runningLate++;
                    }
                  }

                  var waitingOn = "";

                  if (
                    _.includes((s.status || {}).users, Config.user.id) &&
                    !(s.status || {}).completed_at
                  ) {
                    var intizaar = "text-orange text-bold text-highlight";
                    stepStatus = "text-orange";
                    if (!(s.status || {}).is_locked) {
                      stats.myTask++;
                    }

                    var waitingOn = "Waiting on you";
                  } else if (
                    _.includes((s.status || {}).approvers, Config.user.id) &&
                    (s.status || {}).completed_at &&
                    (s.status || {}).needs_approval
                  ) {
                    var intizaar = "text-orange text-bold text-highlight";
                    stepStatus = "text-orange";
                    if (!(s.status || {}).is_locked) {
                      stats.myTask++;
                    }
                    var waitingOn = "Waiting on you";
                  }

                  if (s.status.score) {
                    var step_score = (
                      <span
                        className={
                          "grade-badge notranslate grade-badge-sm grade-b"
                        }
                      />
                    );
                  } else {
                    var step_score = null;
                  }

                  if (s.status.error_flag) {
                    var flag =
                      s.status.error_flag === "red_flag"
                        ? "text-danger"
                        : "text-warning";
                    var error_msg = s.status.error_flag_message
                      .split("|")
                      .join("\n");
                    var step_error_flag = (
                      <span aria-label={error_msg} className="hint--top">
                        <i className={"fa fa-flag " + flag} />
                      </span>
                    );
                  } else {
                    var step_error_flag = null;
                  }

                  return (
                    <li key={"key" + index}>
                      <Link
                        to={
                          "/workflows/instances/" +
                          this.props.workflowData.id +
                          "?step=" +
                          s.id
                        }
                        className="lc-step no-underline"
                        key={s.id}
                      >
                        <span className={stepStatus}>
                          <i
                            className={
                              "material-icons notranslate " + _statusIcon
                            }
                          >
                            {_statusIcon}
                          </i>
                          &nbsp;&nbsp;
                          <span className={intizaar}>{s.name}</span>&nbsp;&nbsp;
                          {step_score}
                          {step_error_flag}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </span>
    );

    return subStepList;
  };

  getSteps2 = stepGroup => {};

  getGroups2 = stepGroup => {
    var steps = (
      <span className="sub-step-list o">
        <div>
          {_.map(stepGroup.step_groups, function(g, index) {
            var steps = _.map(g.steps, function(s) {
              return <div key={"d" + s.id}>{s.id}</div>;
            });
            return (
              <div className="groupaz" key={"key-" + g.id}>
                <div>
                  <span
                    className={"lc-step no-underline text-uppercase grp-class "}
                  >
                    <span>
                      <i className={"material-icons notranslate  "}>
                        panorama_fish_eye
                      </i>{" "}
                      {g.id}
                    </span>&nbsp;&nbsp;
                    {/*g.score*/}
                  </span>
                </div>
                <div className="">{steps ? steps : null}</div>
              </div>
            );
          })}
        </div>
      </span>
    );

    return steps;
  };

  render() {
    var workflowData = this.props.workflowData;

    return (
      <div className="lc-card-body">
        <Row>
          <Col span={12} className="">
            <Link to={"instances/" + workflowData.id + "/"}>
              <Button type="primary">View details</Button>
            </Link>
          </Col>
          <Col span={12} className="text-right text-light small">
            <span>
              {" "}
              Created on:{" "}
              <Moment format="YYYY/MM/DD">{workflowData.created}</Moment>{" "}
              <b>&middot;</b> #{workflowData.increment_id}{" "}
            </span>
          </Col>
        </Row>
        <Divider />
        <div className="steps-wrapper">{this.getGroups(workflowData)}</div>
      </div>
    );
  }
}

class WorkflowList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.listData;
    const data2 = this.props.workflow.workflow;

    return (
      <div>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            background: "#fff"
          }}
        >
          <Collapse accordion>
            {/*_.map(data, function(item, index) {
              return (
                <Panel
                  showArrow={false}
                  header={<Header workflowData={item}  />}
                  key={index}
                  style={{ background: "#fff" }}
                  className="lc-card"
                >
                  <div className="">
                    <WorkflowCardBody workflowData={item} />
                  </div>
                </Panel>
              );
            })*/}

            {_.map(data2, function(item, index) {
              console.log("item------");
              console.log(item);
              return (
                <Panel
                  showArrow={false}
                  header={<Header workflowData={item} />}
                  key={index}
                  style={{ background: "#fff" }}
                  className="lc-card"
                >
                  <div className="">
                    <WorkflowCardBody workflowData={item} />
                  </div>
                </Panel>
              );
            })}
          </Collapse>
        </Content>
      </div>
    );
  }
}

export default WorkflowList;
