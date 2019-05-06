import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import _ from "lodash";
import { Dropdown, Menu, Divider, Row, Col, Tooltip, Tag, Alert } from "antd";
import { utils } from "./utils";
import { FormattedMessage } from "react-intl";
import { ProcessLcData } from "./ProcessLcData";
import { calculatedData } from "./calculated-data";

const { getProcessedData } = calculatedData;
const { getVisibleSteps, isLockedStepEnable, isLockedStepGroupEnable } = utils;

//////////////////
/*workflow body*/
/////////////////

export const WorkflowBody = props => {
  return (
    <div className="lc-card-body">
      <div className="lc-card-section">
        <Row className="card-section-item">
          <Col span={24}>
            <LcData {...props} />
          </Col>
        </Row>

        {!props.statusView ? (
          <Row align="top">
            <Col span={24}>
              <GetQuickData {...props} column={true} />
            </Col>
          </Row>
        ) : props.stepdataloading ? (
          <div className="text-center mr-top-lg"> loading... </div>
        ) : (
          <StepGroupList {...props} />
        )}
      </div>
      <Divider className="no-margin" />
      <MetaRow {...props} />
    </div>
  );
};

const LcData = props => {
  let lcdata = props.workflow.lc_data;
  let lcdataList = _.map(lcdata, (item, index) => {
    if (item.display_type === "normal" && item.value) {
      return (
        <span key={index} className="lc-data-item text-medium ">
          <Tooltip title={item.label + ": " + item.value}>
            <span className="t-cap">
              {item.show_label ? item.label + ": " : ""}
            </span>
            {ProcessLcData(item)}
          </Tooltip>
        </span>
      );
    }
  });

  return (
    <div className="shadow-wrapper shadow-lc">
      <div className="lc-data-wrapper">{lcdataList}</div>
      <div className="white-shadow" />
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
                <FormattedMessage id="commonTextInstances.createdText" />{" "}
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
        <Divider className="no-margin" />
      </div>
    );
  };
}

const StepGroupList = props => {
  let proccessedData = getProcessedData(props.stepGroupData);
  let visible_steps = getVisibleSteps(proccessedData);

  return (
    <div className="shadow-wrapper">
      <div className="sub-step-list">
        <ul className="groupaz-list" id="groupaz-list">
          {_.size(visible_steps) ? (
            _.map(props.stepGroupData, function(group, index) {
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
                    <span className="grp-name  text-normal">
                      <i
                        className={
                          "material-icons mr-right-lg " +
                          (completed
                            ? " text-green "
                            : od ? " text-red " : " text-normal ")
                        }
                      >
                        {completed
                          ? "check_circle "
                          : od ? "alarm" : "panorama_fish_eye"}
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
            })
          ) : (
            <div className="text-medium text-center opacity-half ">
              <FormattedMessage id="errorMessageInstances.noStepInWorkflow" />
            </div>
          )}
        </ul>
      </div>
      <div className="white-shadow" />
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

  let hasAlert = [];

  if (_.size(props.workflow.alerts)) {
    _.forEach(props.workflow.alerts, function(alert) {
      if (alert.step === props.stepData.id) {
        hasAlert.push({
          label: alert.alert.category.name,
          color: alert.alert.category.color_label
        });
      }
    });
  }

  return (
    <li
      className={"t-12 "}
      title={props.stepData.name + (overdue ? " | overdue" : "")}
    >
      {props.showQuickDetails ? (
        /* TODO - remove this quickfix, added for feature toggle / backward compat */
        <span
          onClick={() => {
            props.showQuickDetails(props.stepData);
          }}
          className={"text-anchor text-metal text-nounderline"}
        >
          <i
            className={
              "material-icons text-middle " +
              (step_complete ? "text-green" : overdue ? "text-red" : "")
            }
          >
            {icon_cls}
          </i>
          <span>{props.stepData.name}</span>
          {_.size(hasAlert) ? (
            <span className="alert-dot">
              {_.map(hasAlert, alert => {
                return (
                  <Tooltip title={alert.label}>
                    <i
                      className="material-icons"
                      style={{ fontSize: "9px", color: alert.color }}
                    >
                      fiber_manual_records
                    </i>
                  </Tooltip>
                );
              })}
            </span>
          ) : null}
        </span>
      ) : (
        <Link
          to={{
            pathname: "/workflows/instances/" + props.workflow.id,
            search: "?group=" + props.group.id + "&step=" + props.stepData.id,
            state: {
              step: props.stepData.id,
              group: props.group.id
            }
          }}
          className={
            step_complete
              ? "text-metal text-nounderline"
              : overdue
                ? "text-metal text-nounderline text-normal"
                : "text-metal text-nounderline text-normal"
          }
        >
          <i
            className={
              "material-icons text-middle " +
              (step_complete ? "text-green" : overdue ? "text-red" : "")
            }
          >
            {icon_cls}
          </i>
          <span>{props.stepData.name}</span>
          {_.size(hasAlert) ? (
            <span className="alert-dot">
              {_.map(hasAlert, alert => {
                return (
                  <Tooltip title={alert.label}>
                    <i
                      className="material-icons"
                      style={{ fontSize: "9px", color: alert.color }}
                    >
                      fiber_manual_records
                    </i>
                  </Tooltip>
                );
              })}
            </span>
          ) : null}
        </Link>
      )}
    </li>
  );
};

const GetQuickData = props => {
  return (
    <div className="group-overview">
      <div className="overflow-wrapper">
        <div className="step-ui">
          {_.map(props.workflow.lc_data, function(lcItem, index) {
            return (
              <Tag className="alert-tag-item alert-primary">
                {lcItem.label} : {lcItem.value}
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
};
