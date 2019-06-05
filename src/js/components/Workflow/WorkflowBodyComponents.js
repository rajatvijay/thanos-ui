import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import _ from "lodash";
import { Divider, Row, Col, Tooltip, Tag, Alert } from "antd";
import { utils } from "./utils";
import { FormattedMessage } from "react-intl";
import { ProcessLcData } from "./ProcessLcData";

const { getVisibleSteps, isLockedStepEnable, isLockedStepGroupEnable } = utils;

const LcItem = props => {
  return (
    <div key={props.key} className="lc-data-item">
      <div className="label">{props.label}</div>
      <div className="value">
        {props.value ? props.value : ProcessLcData(props.item)}
      </div>
    </div>
  );
};

export const LcData = props => {
  let lcdata = props.workflow.lc_data;
  let lcdataList = _.map(lcdata, (item, index) => {
    if (item.display_type === "normal" && item.value) {
      return <LcItem key={index} label={item.label} item={item} />;
    }
  });

  return (
    <div className="shadow-wrapper shadow-lc">
      <div className="lc-data-wrapper">
        {props.workflow.lc_duedate ? (
          <LcItem key="eta" label="ETA" value={props.workflow.lc_duedate} />
        ) : null}

        {props.workflow.lc_id ? (
          <LcItem key="id" label="ID" value={props.workflow.lc_id} />
        ) : null}

        <LcItem
          key="id"
          label={<FormattedMessage id="commonTextInstances.createdText" />}
          value={<Moment fromNow>{props.workflow.created_at}</Moment>}
        />

        {lcdataList}
      </div>
      <div className="white-shadow" />
    </div>
  );
};

export const StepGroupList = props => {
  let visible_steps = getVisibleSteps(props.stepGroupData);

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
                            : od ? " text-red " : " text-light ")
                        }
                      >
                        {completed
                          ? "check_circle "
                          : od ? "error" : "panorama_fish_eye"}
                      </i>
                      <span
                        className={
                          " pd-left-sm t-13 text-medium " +
                          (completed ? " text-light" : "")
                        }
                      >
                        {group.definition.name}
                      </span>
                    </span>
                  </div>
                  <ul
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      borderRight: "none"
                    }}
                  >
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
    icon_cls = "error";
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
      className={"t-13 "}
      title={props.stepData.name + (overdue ? " | overdue" : "")}
    >
      {props.showQuickDetails ? (
        /* TODO - remove this quickfix, added for feature toggle / backward compat */
        <span
          onClick={() => {
            props.showQuickDetails(props.stepData);
          }}
          className={"text-anchor  text-nounderline"}
        >
          <i
            className={
              "material-icons text-middle " +
              (step_complete
                ? "text-green "
                : overdue ? "text-red " : " text-light")
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
              ? "text-light text-nounderline"
              : overdue
                ? "text-black text-nounderline text-normal"
                : "text-black text-nounderline text-normal"
          }
        >
          <i
            className={
              "material-icons text-middle " +
              (step_complete
                ? "text-green"
                : overdue ? "text-red" : "text-light")
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

{
  /*export const GetQuickData = props => {
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
};*/
}
